import postgres from "postgres";
import { neon } from "@neondatabase/serverless";
import { GBrainError, type EngineConfig } from "./types.ts";
import { SCHEMA_SQL } from "./schema-embedded.ts";

let sql: any = null;
let connectedUrl: string | null = null;
let isNeonMode = false;

function detectNeon(url: string): boolean {
  return url.includes("neon.tech");
}

/**
 * Default pool size for Postgres connections. Users on the Supabase transaction
 * pooler (port 6543) or any multi-tenant pooler can lower this to avoid
 * MaxClients errors when `gbrain upgrade` spawns subprocesses that each open
 * their own pool. Set `GBRAIN_POOL_SIZE=2` (or similar) before the command.
 */
const DEFAULT_POOL_SIZE_FALLBACK = 10;

export function resolvePoolSize(explicit?: number): number {
  if (typeof explicit === 'number' && explicit > 0) return explicit;
  const raw = process.env.GBRAIN_POOL_SIZE;
  if (raw) {
    const parsed = parseInt(raw, 10);
    if (Number.isFinite(parsed) && parsed > 0) return parsed;
  }
  return DEFAULT_POOL_SIZE_FALLBACK;
}

/**
 * Wraps a neon() SQL-over-HTTP function to present a postgres-compatible API.
 * This lets the rest of gbrain (postgres-engine.ts etc.) work unchanged.
 */
function wrapNeon(neonSql: any): any {
  // The tagged template function itself
  const wrapped: any = (strings: TemplateStringsArray, ...values: any[]) => {
    return neonSql(strings, ...values);
  };

  // .unsafe(rawSqlString) — execute raw SQL (postgres-compatible)
  wrapped.unsafe = async (rawSql: string) => {
    // Split on semicolons for multi-statement SQL (like schema init)
    const statements = rawSql.split(";").map((s: string) => s.trim()).filter((s: string) => s.length > 0);
    let result: any;
    for (const stmt of statements) {
      result = await neonSql.query(stmt, [], { fullResults: true });
    }
    return result?.rows || [];
  };

  // .begin(fn) — transaction (maps to neon's .transaction())
  wrapped.begin = async (fn: (tx: any) => Promise<any>) => {
    return neonSql.transaction((txSql: any) => {
      // Wrap the tx function similarly
      const wrappedTx: any = (strings: TemplateStringsArray, ...values: any[]) => {
        return txSql(strings, ...values);
      };
      wrappedTx.unsafe = async (rawSql: string) => {
        const stmts = rawSql.split(";").map((s: string) => s.trim()).filter((s: string) => s.length > 0);
        let r: any;
        for (const st of stmts) {
          r = await txSql.query(st, [], { fullResults: true });
        }
        return r?.rows || [];
      };
      return fn(wrappedTx);
    });
  };

  // .end() — no-op for HTTP connections
  wrapped.end = async () => {};

  return wrapped;
}

export function getConnection(): any {
  if (!sql) {
    throw new GBrainError(
      "No database connection",
      "connect() has not been called",
      "Run gbrain init --supabase or gbrain init --url <connection_string>",
    );
  }
  return sql;
}

export async function connect(config: EngineConfig): Promise<void> {
  if (sql) {
    if (config.database_url && connectedUrl && config.database_url !== connectedUrl) {
      console.warn("[gbrain] connect() called with a different database_url but a connection already exists.");
    }
    return;
  }

  const url = config.database_url;
  if (!url) {
    throw new GBrainError("No database URL", "database_url is missing from config",
      "Run gbrain init --supabase or gbrain init --url <connection_string>");
  }

  try {
    if (detectNeon(url)) {
      const neonSql = neon(url);
      sql = wrapNeon(neonSql);
      isNeonMode = true;
      await sql`SELECT 1`;
    } else {
      sql = postgres(url, {
        max: resolvePoolSize(),
        idle_timeout: 20,
        connect_timeout: 10,
        types: {
          // Register pgvector type
          bigint: postgres.BigInt,
        },
      });
      isNeonMode = false;
      await sql`SELECT 1`;
    }
    connectedUrl = url;
  } catch (e: unknown) {
    sql = null; connectedUrl = null;
    const msg = e instanceof Error ? e.message : String(e);
    throw new GBrainError("Cannot connect to database", msg,
      "Check your connection URL in ~/.gbrain/config.json");
  }
}

export async function disconnect(): Promise<void> {
  if (sql) {
    await sql.end();
    sql = null; connectedUrl = null;
  }
}

export async function initSchema(): Promise<void> {
  const conn = getConnection();
  if (isNeonMode) {
    await conn.unsafe(SCHEMA_SQL);
  } else {
    await conn`SELECT pg_advisory_lock(42)`;
    try { await conn.unsafe(SCHEMA_SQL); }
    finally { await conn`SELECT pg_advisory_unlock(42)`; }
  }
}

export async function withTransaction<T>(fn: (tx: any) => Promise<T>): Promise<T> {
  const conn = getConnection();
  return conn.begin(async (tx: any) => fn(tx));
}
