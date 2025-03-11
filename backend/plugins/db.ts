import { FastifyPluginAsync } from 'fastify';
import fp from 'fastify-plugin';
import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';
import { dbConfig } from '../config/fastify.config';

// SQLiteデータベースプラグイン
const dbPlugin: FastifyPluginAsync = async (fastify) => {
  try {
    // データベースディレクトリの確認と作成
    const dbDir = path.dirname(dbConfig.path);
    if (!fs.existsSync(dbDir)) {
      fs.mkdirSync(dbDir, { recursive: true });
    }

    // SQLiteデータベースの接続
    const db = new Database(dbConfig.path, { verbose: console.log });
    
    // トランザクション用のヘルパー関数
    const withTransaction = (callback: (db: Database.Database) => any) => {
      db.prepare('BEGIN').run();
      try {
        const result = callback(db);
        db.prepare('COMMIT').run();
        return result;
      } catch (error) {
        db.prepare('ROLLBACK').run();
        throw error;
      }
    };

    // Fastifyインスタンスにデータベースを追加
    fastify.decorate('db', db);
    fastify.decorate('withTransaction', withTransaction);

    // サーバー終了時にデータベース接続をクローズ
    fastify.addHook('onClose', (instance, done) => {
      if (db) {
        db.close();
      }
      done();
    });

    fastify.log.info('SQLite database connected successfully');
  } catch (error) {
    fastify.log.error('Failed to connect to SQLite database:', error);
    throw error;
  }
};

// Fastifyプラグインとしてエクスポート
export default fp(dbPlugin, {
  name: 'db',
  dependencies: [],
});

// TypeScriptの型定義拡張
declare module 'fastify' {
  interface FastifyInstance {
    db: Database.Database;
    withTransaction: (callback: (db: Database.Database) => any) => any;
  }
}
