import { FastifyInstance } from 'fastify';
import Database from 'better-sqlite3';

export interface User {
  id: number;
  username: string;
  email: string;
  password_hash: string;
  avatar_url?: string;
  status: string;
  two_factor_enabled: boolean;
  two_factor_secret?: string;
  created_at: string;
  updated_at: string;
}

export class UserModel {
  private db: Database.Database;

  constructor(fastify: FastifyInstance) {
    this.db = fastify.db;
  }

  // ユーザーの作成
  createUser(user: Omit<User, 'id' | 'created_at' | 'updated_at'>): User {
    const stmt = this.db.prepare(`
      INSERT INTO users (username, email, password_hash, avatar_url, status, two_factor_enabled, two_factor_secret)
      VALUES (@username, @email, @password_hash, @avatar_url, @status, @two_factor_enabled, @two_factor_secret)
      RETURNING *
    `);
    
    return stmt.get(user) as User;
  }

  // ユーザー名でユーザーを検索
  findByUsername(username: string): User | undefined {
    const stmt = this.db.prepare('SELECT * FROM users WHERE username = ?');
    return stmt.get(username) as User | undefined;
  }

  // メールアドレスでユーザーを検索
  findByEmail(email: string): User | undefined {
    const stmt = this.db.prepare('SELECT * FROM users WHERE email = ?');
    return stmt.get(email) as User | undefined;
  }

  // IDでユーザーを検索
  findById(id: number): User | undefined {
    const stmt = this.db.prepare('SELECT * FROM users WHERE id = ?');
    return stmt.get(id) as User | undefined;
  }

  // 全ユーザーを取得
  findAll(): User[] {
    const stmt = this.db.prepare('SELECT * FROM users');
    return stmt.all() as User[];
  }

  // ユーザー情報の更新
  updateUser(id: number, userData: Partial<User>): User | undefined {
    // 更新するフィールドを動的に構築
    const fields = Object.keys(userData)
      .filter(key => key !== 'id' && key !== 'created_at')
      .map(key => `${key} = @${key}`)
      .join(', ');
    
    if (!fields) return this.findById(id);

    const stmt = this.db.prepare(`
      UPDATE users
      SET ${fields}, updated_at = CURRENT_TIMESTAMP
      WHERE id = @id
      RETURNING *
    `);
    
    return stmt.get({ ...userData, id }) as User | undefined;
  }

  // ユーザーの削除
  deleteUser(id: number): boolean {
    const stmt = this.db.prepare('DELETE FROM users WHERE id = ?');
    const result = stmt.run(id);
    return result.changes > 0;
  }

  // ユーザーのステータス更新
  updateStatus(id: number, status: string): boolean {
    const stmt = this.db.prepare(`
      UPDATE users
      SET status = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `);
    const result = stmt.run(status, id);
    return result.changes > 0;
  }
}
