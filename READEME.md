## 動作確認手順
### Express サーバーの作業

1. `server/` ディレクトリに移動
2. `yarn install` コマンドを実行
3. VAPIDを生成
```bash
npx web-push generate-vapid-keys
```
3. `.env`ファイルを作成し、以下の環境変数を設定
   ```
   VAPID_PUBLIC_KEY=<VAPID公開鍵>
   VAPID_PRIVATE_KEY=<VAOID秘密鍵>
   PORT=3000
   ```

### React アプリケーションの作業

1. `client/` ディレクトリに移動
2. `yarn install` コマンドを実行
3. `.env` ファイルを作成し、以下の環境変数を設定
   ```
   VITE_PUBLIC_VAPID_KEY=<VAPID公開鍵>
   ```
4. `yarn build` コマンドを実行

### Express サーバーの起動
```bash
$ cd server
$ yarn start
```

### 想定のディレクトリ構成

```
web-push-demo/
├── client/                     # Reactアプリケーションのディレクトリ
│   ├── public/
│   │   ├── service-worker.js  # Service Workerファイル
│   │   └── ...
│   ├── src/
│   │   ├── App.jxs             # Reactアプリケーションのメインコンポーネント
│   │   ├── main.jxs            # Reactアプリケーションのエントリーポイント
│   │   └── ...
│   ├── .gitignore
│   ├── package.json
|   ├── .env                    # 環境変数設定ファイル
│   └── yarn.lock
├── server/                     # Expressサーバーのディレクトリ
│   ├── index.js                # Expressサーバーのエントリーポイント
│   ├── .gitignore
│   ├── package.json
|   ├── .env                    # 環境変数設定ファイル
│   └── yarn.lock
├── README.md                   # このファイル
└── .gitignore                  # プロジェクト全体のGit ignore設定
```
