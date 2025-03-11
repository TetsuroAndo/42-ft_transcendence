import { FastifyServerOptions } from 'fastify';
import dotenv from 'dotenv';

// .envファイルを読み込む
dotenv.config({ path: '../.env' });

// 環境変数からポート番号を取得（デフォルト値：4000）
const PORT = parseInt(process.env.BACKEND_PORT || '4000', 10);
const HOST = process.env.BACKEND_HOST || 'localhost';

// Fastifyサーバーのオプション
export const fastifyConfig: FastifyServerOptions = {
  logger: true,
  trustProxy: true,
};

// サーバー設定
export const serverConfig = {
  port: PORT,
  host: HOST,
};

// JWT設定
export const jwtConfig = {
  secret: process.env.JWT_SECRET || 'your_default_secret_key',
  expiresIn: process.env.JWT_EXPIRES_IN || '7d',
};

// SQLite設定
export const dbConfig = {
  path: process.env.DB_PATH || './data/sqlite.db',
};
