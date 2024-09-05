import { useEffect } from 'react';

function App() {

  // VAPIDキーの設定
  const publicKey = import.meta.env.VITE_PUBLIC_VAPID_KEY;

  // Service Workerの登録
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      // Service Workerの起動(publicディレクトリにservice-worker.jsを配置)
      navigator.serviceWorker.register('/service-worker.js')
        .then(function(registration) {
          console.log('Service Workerが登録されました:', registration);
        })
        .catch(function(error) {
          console.error('Service Workerの登録に失敗しました:', error);
        });
    } else {
      console.warn('このブラウザはService Workerをサポートしていません');
    }
  }, []);

  // プッシュ通知の購読
  function subscribeToPush() {
    // serviceWorkerとPushManagerがサポートされているか確認
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      // Service Workerの準備ができたら
      navigator.serviceWorker.ready.then(function(registration) {
        console.log('Service Workerの準備ができました');
        return registration.pushManager.getSubscription()
          .then(function(subscription) {
            if (subscription) {
              return subscription;
            }

            const applicationServerKey = urlB64ToUint8Array(publicKey);
            return registration.pushManager.subscribe({
              userVisibleOnly: true,
              applicationServerKey: applicationServerKey
            });
          })
          .then(function(subscription) {
            // サーバーにプッシュ通知の購読情報を送信
            return fetch('/api/subscribe', {
              method: 'POST',
              body: JSON.stringify(subscription),
              headers: {
                'Content-Type': 'application/json'
              }
            });
          })
          .then(function(response) {
            if (!response.ok) {
              throw new Error('購読に失敗しました。');
            }
            // プッシュ通知の送信
            fetch('/api/sendNotification', {
              method: 'POST',
            }).then(response => {
              if (!response.ok) {
                throw new Error('通知の送信に失敗しました。');
              }
              console.log('通知を送信しました！');
            }).catch(error => {
              console.error('通知の送信に失敗しました:', error);
            });
          })
          .catch(function(error) {
            console.error('購読に失敗しました:', error);
          });
      });
    } else {
      console.warn('Service WorkersまたはPush Managerがこのブラウザではサポートされていません');
    }
  }

  // VAPIDの公開キー（Base64 URL形式）をバイナリ形式のUint8Arrayに変換する
  function urlB64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }

    return outputArray;
  }

  return (
    <div>
      <h1>Web Push Notification Demo</h1>
      <button onClick={() => subscribeToPush()}>Subscribe to Push Notifications</button>
    </div>
  );
}

export default App;