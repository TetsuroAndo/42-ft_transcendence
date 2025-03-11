import Fastify, { FastifyInstance } from 'fastify';
import cors from '@fastify/cors';
import jwt from '@fastify/jwt';
import swagger from '@fastify/swagger';
import { fastifyConfig, serverConfig, jwtConfig } from './config/fastify.config';
import dbPlugin from './plugins/db';
import dbInitPlugin from './plugins/db-init';

// Fastifyインスタンスの作成
const server: FastifyInstance = Fastify(fastifyConfig);

// SQLiteデータベースプラグインの登録
server.register(dbPlugin);
server.register(dbInitPlugin);

// CORSの設定
server.register(cors, {
  origin: `http://${process.env.FRONTEND_HOST || 'localhost'}:${process.env.FRONTEND_PORT || '3000'}`,
  credentials: true
});

// JWTの設定
server.register(jwt, {
  secret: jwtConfig.secret,
  sign: {
    expiresIn: jwtConfig.expiresIn
  }
});

// Swaggerの設定
server.register(swagger, {
  openapi: {
    info: {
      title: 'ft_transcendence API',
      description: 'API documentation for ft_transcendence project',
      version: '1.0.0'
    },
    servers: [
      {
        url: `http://${serverConfig.host}:${serverConfig.port}`
      }
    ]
  }
});

// ルートエンドポイント
server.get('/', async (request, reply) => {
  return { message: 'Welcome to ft_transcendence API' };
});

// サーバーの起動
const start = async () => {
  try {
    await server.listen({ 
      port: serverConfig.port, 
      host: serverConfig.host === 'localhost' ? '0.0.0.0' : serverConfig.host 
    });
    console.log(`Server is running on ${serverConfig.host}:${serverConfig.port}`);
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start();
