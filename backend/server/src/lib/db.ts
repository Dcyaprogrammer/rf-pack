import { dbPool, getDb } from "@zhitou/database";

const databaseUrl = process.env.DATABASE_URL as string;
if (!databaseUrl) {
  // 运行时如果未配置会在首次访问时报错，避免静态导入失败
  // 这里仍创建一个空的占位以便类型通过
}

const pool = databaseUrl ? dbPool(databaseUrl) : undefined as any;
const db = databaseUrl ? getDb(pool) : (undefined as any);

export default db;


