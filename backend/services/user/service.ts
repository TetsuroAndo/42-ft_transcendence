import { FastifyInstance } from 'fastify';
import { UserModel, User } from './model';
import bcrypt from 'bcrypt';

export class UserService {
  private userModel: UserModel;

  constructor(fastify: FastifyInstance) {
    this.userModel = new UserModel(fastify);
  }

  // ユーザー登録
  async register(userData: {
    username: string;
    email: string;
    password: string;
    avatar_url?: string;
  }): Promise<User> {
    // ユーザー名とメールアドレスの重複チェック
    const existingUser = this.userModel.findByUsername(userData.username);
    if (existingUser) {
      throw new Error('Username already exists');
    }

    const existingEmail = this.userModel.findByEmail(userData.email);
    if (existingEmail) {
      throw new Error('Email already exists');
    }

    // パスワードのハッシュ化
    const saltRounds = 10;
    const password_hash = await bcrypt.hash(userData.password, saltRounds);

    // ユーザーの作成
    return this.userModel.createUser({
      username: userData.username,
      email: userData.email,
      password_hash,
      avatar_url: userData.avatar_url,
      status: 'online',
      two_factor_enabled: false,
    });
  }

  // ログイン認証
  async authenticate(username: string, password: string): Promise<User | null> {
    const user = this.userModel.findByUsername(username);
    if (!user) {
      return null;
    }

    // パスワードの検証
    const isValid = await bcrypt.compare(password, user.password_hash);
    if (!isValid) {
      return null;
    }

    // ユーザーステータスをオンラインに更新
    this.userModel.updateStatus(user.id, 'online');

    return user;
  }

  // ユーザー情報の取得
  getUserById(id: number): User | undefined {
    return this.userModel.findById(id);
  }

  // ユーザー情報の更新
  updateUser(id: number, userData: Partial<User>): User | undefined {
    return this.userModel.updateUser(id, userData);
  }

  // ユーザーの削除
  deleteUser(id: number): boolean {
    return this.userModel.deleteUser(id);
  }

  // 全ユーザーの取得
  getAllUsers(): User[] {
    return this.userModel.findAll();
  }

  // ユーザーステータスの更新
  updateUserStatus(id: number, status: string): boolean {
    return this.userModel.updateStatus(id, status);
  }
}
