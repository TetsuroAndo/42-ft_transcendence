import dotenv from 'dotenv';

// .envファイルを読み込む
dotenv.config({ path: '../.env' });

// WebSocketサーバーの設定
export const wssConfig = {
  // ゲーム関連のWebSocket設定
  game: {
    path: '/socket.io/game',
    cors: {
      origin: `http://${process.env.FRONTEND_HOST || 'localhost'}:${process.env.FRONTEND_PORT || '3000'}`,
      methods: ['GET', 'POST'],
      credentials: true
    },
  },
  
  // チャット関連のWebSocket設定
  chat: {
    path: '/socket.io/chat',
    cors: {
      origin: `http://${process.env.FRONTEND_HOST || 'localhost'}:${process.env.FRONTEND_PORT || '3000'}`,
      methods: ['GET', 'POST'],
      credentials: true
    },
  },
  
  // トーナメント関連のWebSocket設定
  tournament: {
    path: '/socket.io/tournament',
    cors: {
      origin: `http://${process.env.FRONTEND_HOST || 'localhost'}:${process.env.FRONTEND_PORT || '3000'}`,
      methods: ['GET', 'POST'],
      credentials: true
    },
  }
};
