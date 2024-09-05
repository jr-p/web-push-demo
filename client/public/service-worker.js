self.addEventListener('push', function(event) {
  let data = {};
  console.log('Push event:', event);
  // プッシュメッセージのデータを取得
  if (event.data) {
    try {
      data = event.data.json();
    } catch (error) {
      console.error(error);
      return;
    }
  }

  // プッシュ通知のオプションを設定
  const options = {
    body: data.body || 'Default body',
    icon: data.icon || '/icon-192x192.png',
    badge: data.badge || '/badge-72x72.png'
  };

  // 通知を表示
  event.waitUntil(
    self.registration.showNotification(data.title || 'Default Title', options)
  );
});