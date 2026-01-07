# Tailhook セットアップガイド

このガイドでは、Tailhook Chrome拡張機能の開発環境のセットアップから、拡張機能のインストール、Logi Options+との連携まで、詳細な手順を説明します。

## 前提条件

以下がインストールされていることを確認してください:

- **Node.js** (v14以上推奨) - [nodejs.org](https://nodejs.org/)
- **npm** (Node.jsに付属)
- **Google Chrome** ブラウザ
- **Logi Options+** (Logicoolマウス/キーボードユーザーの場合)

### Node.jsのインストール確認

```bash
node --version
npm --version
```

## クイックスタート（5分）

```bash
# 1. リポジトリをクローン
git clone https://github.com/yourusername/tailhook.git
cd tailhook

# 2. 依存関係をインストールしてアイコンを生成
npm install
npm run build:icons

# 3. Chromeで拡張機能を読み込む
# - chrome://extensions/ を開く
# - デベロッパーモードをON
# - 「パッケージ化されていない拡張機能を読み込む」
# - tailhookディレクトリを選択
```

## 詳細なセットアップ手順

### 1. プロジェクトのクローン

```bash
git clone https://github.com/yourusername/tailhook.git
cd tailhook
```

### 2. 依存関係のインストール

```bash
npm install
```

これにより以下がインストールされます:
- `sharp` - SVGからPNGへの変換ライブラリ

### 3. アイコンの生成

```bash
npm run build:icons
```

このコマンドは以下を実行します:
1. `icons/icon.svg` を読み込み
2. 16x16、48x48、128x128のPNG画像を生成
3. `icons/` ディレクトリに保存

生成されたファイルを確認:
```bash
ls -lh icons/*.png
```

出力例:
```
-rw-r--r-- 1 user user 3.2K Jan  7 11:11 icons/icon128.png
-rw-r--r-- 1 user user  454 Jan  7 11:11 icons/icon16.png
-rw-r--r-- 1 user user 1.4K Jan  7 11:11 icons/icon48.png
```

### 4. Chrome拡張機能として読み込む

#### ステップ 4.1: Chrome拡張機能ページを開く

1. Google Chromeを開く
2. アドレスバーに `chrome://extensions/` と入力してEnter
3. または、メニュー → その他のツール → 拡張機能

#### ステップ 4.2: デベロッパーモードを有効化

- ページ右上の「デベロッパーモード」トグルをONにする

#### ステップ 4.3: 拡張機能を読み込む

1. 「パッケージ化されていない拡張機能を読み込む」ボタンをクリック
2. ファイル選択ダイアログで `tailhook` ディレクトリを選択
3. 「選択」をクリック

#### ステップ 4.4: 確認

- 拡張機能リストに「Tailhook」が表示されます
- Chromeツールバーに🪝アイコンが表示されます
- 拡張機能がデフォルトで有効になっています（緑のトグル）

### 5. 動作確認

#### テスト 1: ポップアップUIの確認

1. ツールバーの🪝Tailhookアイコンをクリック
2. ポップアップが表示され、以下が確認できるはず:
   - 「Enable Extension」トグル（ONになっている）
   - キーコンビネーション: Ctrl + Shift + T
   - サポートされているサイト: ChatGPT
   - ステータス: Active

#### テスト 2: ChatGPTでの動作確認

1. https://chat.openai.com にアクセス
2. デベロッパーコンソールを開く（F12キー）
3. Consoleタブを選択
4. ChatGPTに質問する（例: "Hello, how are you?"）
5. コンソールに以下のようなログが表示されるはず:

```
[Tailhook] Content script loaded
[Tailhook] Extension enabled: true
[Tailhook] MutationObserver initialized
[Tailhook] Response completion detected
[Tailhook] ✓ Key combination triggered: Ctrl+Shift+T
```

## Logi Options+との連携

### Smart Actionsの設定

1. **Logi Options+を開く**
   - Windows: スタートメニューから「Logi Options+」を検索
   - macOS: アプリケーションフォルダから起動

2. **デバイスを選択**
   - 左側のデバイスリストから使用中のマウス/キーボードを選択

3. **Smart Actionsを開く**
   - 「Smart Actions」タブをクリック

4. **新しいアクションを作成**
   - 「+」または「Add Action」ボタンをクリック

5. **トリガーを設定**
   - Trigger: 「Keyboard」を選択
   - Key Combination: **Ctrl+Shift+T** を設定

6. **アクションを設定**

   例1: 特定のアプリに切り替え
   - Action: 「Switch Application」
   - Application: 使用したいアプリを選択

   例2: カスタムキー送信
   - Action: 「Keystroke」
   - Keys: 任意のキーコンビネーション

   例3: マクロ実行
   - Action: 「Run Macro」
   - Macro: 事前に作成したマクロを選択

7. **保存**
   - アクション名をつけて保存（例: "ChatGPT Complete Action"）

### 動作テスト

1. ChatGPT (https://chat.openai.com) にアクセス
2. 質問を入力して送信
3. 応答が完了すると:
   - TailhookがCtrl+Shift+Tを発火
   - Logi Options+が設定したアクションを実行

## トラブルシューティング

### 問題: 拡張機能が読み込めない

**原因**: manifest.jsonのパスが正しくない、またはアイコンが生成されていない

**解決方法**:
```bash
# アイコンを再生成
npm run build:icons

# ファイルが存在するか確認
ls -l icons/*.png
ls -l manifest.json
```

### 問題: ChatGPTで応答が検知されない

**原因**: コンテンツスクリプトが正しく注入されていない、またはChatGPTのDOM構造が変更された

**解決方法**:
1. デベロッパーコンソール（F12）を開く
2. Consoleタブで `[Tailhook]` を検索
3. エラーメッセージを確認
4. ページをリロード（Ctrl+R / Cmd+R）
5. 拡張機能を再読み込み（chrome://extensions/で「更新」ボタン）

### 問題: Logi Options+がキーイベントを検知しない

**原因**: Chrome拡張機能はブラウザ内のJavaScriptイベントのみを生成し、OSレベルのキーイベントではない

**現在の制限事項**:
Logi Options+はOSレベルのキーイベントを必要とする場合があります。現在のバージョンはブラウザレベルのイベントのみをサポートしています。

**代替案（Phase 2で実装予定）**:

1. **Native Messaging API** (推奨)
   - Chrome拡張機能からローカルアプリケーションにメッセージを送信
   - ローカルアプリがOSレベルのキーイベントを生成
   - Windows: AutoIt, Python + pyautogui
   - macOS: Hammerspoon, Python + pyautogui
   - Linux: xdotool, Python + pyautogui

2. **WebSocketサーバー**
   - ローカルでWebSocketサーバーを実行
   - 拡張機能からサーバーにメッセージを送信
   - サーバーがOSレベルのキーイベントを生成

3. **通知ベースのトリガー**
   - 拡張機能がChrome通知を送信
   - AutoHotkey/Hammerspoonが通知を検知してアクションを実行

**暫定対応**:
現在の実装でも、ブラウザ内の操作（タブ切り替えなど）は可能です。まずは実際に試してみて、必要に応じて上記の代替案を実装してください。

### 問題: アイコンが表示されない

**原因**: PNG画像が正しく生成されていない

**解決方法**:
```bash
# アイコンを再生成
npm run build:icons

# ファイルサイズを確認（0バイトでないこと）
ls -lh icons/*.png

# 拡張機能を再読み込み
# chrome://extensions/ で「更新」ボタンをクリック
```

## 開発者向け情報

### ファイル構造の説明

```
tailhook/
├── manifest.json           # Chrome拡張機能の設定ファイル
├── package.json            # npm依存関係の管理
├── .gitignore             # Git除外ファイルリスト
│
├── src/
│   ├── content.js         # ChatGPTページに注入されるスクリプト
│   │                       # - MutationObserverでDOM監視
│   │                       # - 応答完了を検知してキーイベント発火
│   │
│   ├── background.js      # バックグラウンドで実行されるサービスワーカー
│   │                       # - 拡張機能の初期化
│   │                       # - 状態管理
│   │
│   └── popup/
│       ├── popup.html     # 拡張機能ポップアップのHTML
│       ├── popup.css      # ポップアップのスタイル
│       └── popup.js       # ポップアップのロジック（ON/OFF切り替え）
│
├── scripts/
│   └── generate-icons.js  # SVG→PNG変換スクリプト
│
├── icons/
│   ├── icon.svg          # マスターアイコン（ベクター形式）
│   ├── icon16.png        # 16x16 ツールバーアイコン
│   ├── icon48.png        # 48x48 拡張機能管理ページ用
│   └── icon128.png       # 128x128 Chromeウェブストア用
│
├── README.md             # 英語版ドキュメント
├── README_JA.md          # 日本語版ドキュメント
└── SETUP.md              # このファイル
```

### 設定のカスタマイズ

#### デバウンス時間の変更

`src/content.js` の `CONFIG.DEBOUNCE_DELAY` を変更:

```javascript
const CONFIG = {
  DEBOUNCE_DELAY: 800,  // デフォルト: 800ms
  // ...
};
```

- **短くする** (例: 500ms): より早く反応するが、誤検知のリスク増加
- **長くする** (例: 1200ms): より確実だが、反応が遅い

#### キーコンビネーションの変更

`src/content.js` の `CONFIG.KEY_COMBINATION` を変更:

```javascript
const CONFIG = {
  // ...
  KEY_COMBINATION: {
    key: 'T',           // 任意のキー
    ctrlKey: true,      // Ctrl
    shiftKey: true,     // Shift
    altKey: false,      // Alt
    metaKey: false      // Cmd (macOS) / Win (Windows)
  }
};
```

例: Ctrl+Alt+Hに変更
```javascript
KEY_COMBINATION: {
  key: 'H',
  ctrlKey: true,
  shiftKey: false,
  altKey: true,
  metaKey: false
}
```

**重要**: 変更後は拡張機能を再読み込みしてください。

### デバッグモードの有効化

現在、すべてのログは常に有効です。コンソールを開いて `[Tailhook]` で検索してください。

将来のバージョンでは、設定でログレベルを変更可能にする予定です。

### 拡張機能の更新

コードを変更した後:

1. ファイルを保存
2. `chrome://extensions/` を開く
3. Tailhook拡張機能の「更新」ボタンをクリック
4. またはChrome拡張機能ページで Ctrl+R (Cmd+R)

**Hot Reload対応していないため、手動での更新が必要です。**

## よくある質問 (FAQ)

### Q1: 他のLLMサービス（Claude、Geminiなど）にも対応できますか？

A: 現在のバージョン（Phase 1）はChatGPTのみに対応しています。Phase 2で複数サービス対応を予定しています。技術的には可能で、各サービスのDOM構造に合わせた検知ロジックを追加する必要があります。

### Q2: キーコンビネーションをポップアップから変更できますか？

A: 現在はコード変更が必要です（上記「設定のカスタマイズ」参照）。Phase 2でUIから変更可能にする予定です。

### Q3: Chromeウェブストアで公開されますか？

A: 現在は開発版のみです。安定性とフィードバックを確認した後、ウェブストアでの公開を検討します。

### Q4: Firefoxには対応しますか？

A: 現在はChrome（Manifest V3）のみです。将来的にWebExtensions互換のバージョンを検討しています。

### Q5: プライバシーは大丈夫ですか？データは外部に送信されますか？

A: Tailhookは完全にローカルで動作します。以下のことを行いません:
- データの外部送信
- チャット内容の保存
- 個人情報の収集
- トラッキング

コードはすべてオープンソースで、自由に検証できます。

## サポート

問題が発生した場合:

1. **GitHub Issues**: https://github.com/yourusername/tailhook/issues
2. **GitHub Discussions**: https://github.com/yourusername/tailhook/discussions

issue報告時には以下を含めてください:
- OS & バージョン（例: Windows 11、macOS 14.0）
- Chromeバージョン
- エラーメッセージ（コンソールのスクリーンショット）
- 再現手順

## 次のステップ

拡張機能のインストールが完了したら:

1. [README_JA.md](README_JA.md) で使い方を確認
2. ChatGPTで実際に試してみる
3. Logi Options+でSmart Actionsを設定
4. フィードバックをGitHubで共有

---

**Happy Hooking! 🪝**
