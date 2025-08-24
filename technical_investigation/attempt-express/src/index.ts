import express, { Request, Response } from 'express';

const app = express();
const PORT = process.env.PORT || 3000;

// JSONボディパーサーを有効化
app.use(express.json());

// 基本的なルート
app.get('/', (req: Request, res: Response) => {
  res.json({
    message: 'Welcome Attempt Express with Docker',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// ヘルスチェックエンドポイント
app.get('/health', (req: Request, res: Response) => {
  res.json({
    status: 'OK',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// ユーザー情報を取得するサンプルAPI
app.get('/users', (req: Request, res: Response) => {
  const users = [
    { id: 1, name: '田中太郎', email: 'tanaka@example.com' },
    { id: 2, name: '佐藤花子', email: 'sato@example.com' },
    { id: 3, name: '鈴木一郎', email: 'suzuki@example.com' }
  ];
  res.json(users);
});

// POSTリクエストのサンプル
app.post('/api/users', (req: Request, res: Response) => {
  const { name, email } = req.body;
  
  if (!name || !email) {
    return res.status(400).json({
      error: '名前とメールアドレスは必須です'
    });
  }
  
  // 実際のアプリケーションではデータベースに保存します
  const newUser = {
    id: Date.now(),
    name,
    email
  };
  
  res.status(201).json(newUser);
});

// サーバー起動
app.listen(PORT, () => {
  console.log(`🚀 サーバーがポート ${PORT} で起動しました`);
  console.log(`📱 アプリケーション: http://localhost:${PORT}`);
  console.log(`🏥 ヘルスチェック: http://localhost:${PORT}/health`);
});
