const express = require('express');
const webPush = require('web-push');
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// VAPIDキーの設定
webPush.setVapidDetails(
  'mailto:test@example.com',
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

// ミドルウェアの設定
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../client/dist')));

let subscriptions = [];

// プッシュ通知購読のエンドポイント
app.post('/api/subscribe', (req, res) => {
  const subscription = req.body;
  if (!subscription) {
    return res.status(400).json({ error: 'Subscriptionは必須です' });
  }
  subscriptions.push(subscription);
  res.status(201).json({});
});

// プッシュ通知送信のエンドポイント
app.post('/api/sendNotification', (req, res) => {
  const payload = JSON.stringify({ title: 'Test Notification', body: 'テストプッシュ通知を表示してます。' });

  if (subscriptions.length === 0) {
    return res.status(400).json({ error: '利用可能なSubscriptionがありません' });
  }

  Promise.all(subscriptions.map(sub => webPush.sendNotification(sub, payload)))
    .then(() => res.status(200).json({ message: 'Notification sent!' }))
    .catch(err => {
      console.error('通知の送信に失敗しました:', err);
      res.status(500).json({ error: '通知の送信に失敗しました' });
    });
});

// Reactアプリのためのルート
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});