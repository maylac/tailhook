# 🪝 Tailhook

**Tailhook**（テイルフック）は、LLMサービス（ChatGPTなど）の応答完了を検知し、自動的にカスタムキーコンビネーションを発火させるChrome拡張機能です。Logi Options+のSmart Actionsと組み合わせて、業務効率化を実現します。

[English README](README.md)

## 🎯 機能

### Phase 1 (MVP) - 現在のバージョン
- ✅ ChatGPTの応答完了をリアルタイムで検知
- ✅ 設定可能なキーコンビネーション（Ctrl+Shift+T）を発火
- ✅ 拡張機能のポップアップからON/OFF切り替え
- ✅ chat.openai.com と chatgpt.com の両方に対応
- ✅ ストリーミング中の誤検知を防ぐスマートデバウンス

### Phase 2 (今後の予定)
- 🔄 複数のLLMサービス対応（Claude、Gemini等）
- 🔄 カスタマイズ可能なキーコンビネーション
- 🔄 詳細設定ページ
- 🔄 複数のトリガーアクションプロファイル

## 🚀 インストール

### ソースからのインストール（開発版）

1. **リポジトリをクローン**
   ```bash
   git clone https://github.com/yourusername/tailhook.git
   cd tailhook
   ```

2. **依存関係をインストール & アイコンを生成**
   ```bash
   npm install
   npm run build:icons
   ```

   これにより、必要な16x16、48x48、128x128のPNGアイコンが自動生成されます。

3. **Chromeに拡張機能を読み込む**
   - Chromeで `chrome://extensions/` を開く
   - 右上の「デベロッパーモード」をONにする
   - 「パッケージ化されていない拡張機能を読み込む」をクリック
   - `tailhook` ディレクトリを選択
   - Chromeツールバーに拡張機能アイコンが表示されます

## 📖 使い方

### 基本的な使い方

1. **拡張機能を有効化**
   - Chromeツールバーのテイルフックアイコンをクリック
   - トグルがONになっていることを確認（デフォルトでON）

2. **ChatGPTで使用**
   - https://chat.openai.com または https://chatgpt.com にアクセス
   - ChatGPTに質問する
   - 応答が完了すると、Tailhookが自動的に **Ctrl+Shift+T** を発火

3. **Logi Options+との連携**
   - Logi Options+アプリケーションを開く
   - Smart Actionsに移動
   - **Ctrl+Shift+T** でトリガーされる新しいアクションを作成
   - 好きな自動化を設定（タブ切り替え、コマンド実行など）

### 一時的に無効化

拡張機能アイコンをクリックしてトグルをOFFにすると、拡張機能を削除せずに検知を無効化できます。

## 🔧 技術詳細

### 動作の仕組み

1. **コンテンツスクリプト** (`src/content.js`)
   - ChatGPTページに注入
   - `MutationObserver` を使用してDOM変更を監視
   - 以下の条件でストリーミング停止を検知:
     - 「Stop generating」ボタンの消失
     - DOM変更が800ms間停止（デバウンス）
     - 応答エリアの完了インジケーター

2. **バックグラウンドサービスワーカー** (`src/background.js`)
   - 拡張機能のライフサイクルを管理
   - インストールと状態の初期化を処理

3. **ポップアップUI** (`src/popup/`)
   - シンプルなON/OFFトグルを提供
   - 現在のステータスと設定を表示
   - Chrome Storage APIで状態を永続化

### キーコンビネーション

デフォルトでは、Tailhookは以下を発火: **Ctrl + Shift + T**

Phase 2では設定ページでカスタマイズ可能になる予定です。

### 検知ロジック

```
ChatGPTがストリーミング開始 → MutationObserverがDOM変更を検知
                          ↓
                ストリーミング継続中（アクションなし）
                          ↓
            DOM変更が800ms間停止
                          ↓
        「Stop generating」ボタンが消失したことを確認
                          ↓
         キーボードイベントを発火（Ctrl+Shift+T）
```

## ⚠️ 重要な注意事項

### Logi Options+との互換性

Chrome拡張機能はJavaScriptのキーボードイベントのみを生成でき、OSレベルのキー入力ではありません。**Logi Options+のSmart Actionsでは検知されない可能性があります。**

**Logi Options+がイベントを検知しない場合**、以下の代替案を検討してください:

1. **Native Messaging** - Chrome Native Messaging APIを使用してローカルアプリケーションと通信し、OSレベルのキー入力を生成
2. **AutoHotkey/Hammerspoon** - 自動化ツールを使用してChrome通知を検知し、アクションをトリガー
3. **WebSocketサーバー** - ローカルサーバーを実行し、拡張機能からコマンドを受信してOSレベルのイベントをトリガー

まずはブラウザレベルのイベントをテストし、必要に応じてNative Messagingを実装できます。

### ChatGPTのDOM変更について

ChatGPTのDOM構造は頻繁に変更されます。ChatGPTのアップデート後に検知が機能しなくなった場合:

1. ブラウザコンソールを開く（F12）
2. Tailhookのログを確認: `[Tailhook]`
3. コンソールログを添えてGitHubでissueを報告してください

## 🛠️ 開発

### プロジェクト構成

```
tailhook/
├── manifest.json           # 拡張機能マニフェスト（Manifest V3）
├── package.json            # npm設定
├── src/
│   ├── content.js         # DOM監視と検知ロジック
│   ├── background.js      # サービスワーカー
│   └── popup/
│       ├── popup.html     # ポップアップUI
│       ├── popup.css      # ポップアップスタイル
│       └── popup.js       # ポップアップロジック
├── scripts/
│   └── generate-icons.js  # アイコン生成スクリプト
├── icons/
│   ├── icon.svg          # ソースアイコン（ベクター）
│   ├── icon16.png        # 16x16アイコン
│   ├── icon48.png        # 48x48アイコン
│   └── icon128.png       # 128x128アイコン
├── .gitignore
├── LICENSE
├── README.md             # 英語版README
└── README_JA.md          # 日本語版README（このファイル）
```

### 設定

主要な設定は `src/content.js` で変更できます:

```javascript
const CONFIG = {
  DEBOUNCE_DELAY: 800,        // トリガー前の待機時間（ミリ秒）
  KEY_COMBINATION: {
    key: 'T',
    ctrlKey: true,
    shiftKey: true,
    altKey: false,
    metaKey: false
  }
};
```

### デバッグ

詳細なログを有効化:

1. ChatGPTページを開く
2. デベロッパーコンソールを開く（F12）
3. `[Tailhook]` で始まるログを確認

ログの例:
```
[Tailhook] Content script loaded
[Tailhook] Extension enabled: true
[Tailhook] MutationObserver initialized
[Tailhook] Response completion detected
[Tailhook] ✓ Key combination triggered: Ctrl+Shift+T
```

### アイコンの再生成

アイコンのデザインを変更した場合:

```bash
# icons/icon.svg を編集
npm run build:icons
```

## 🤝 コントリビューション

コントリビューションを歓迎します！issueやプルリクエストをお気軽に提出してください。

### ロードマップ

- [ ] 複数サービス対応（Claude、Gemini、Perplexity）
- [ ] カスタムキーコンビネーション設定
- [ ] 詳細設定のオプションページ
- [ ] OSレベルキーイベント用のNative Messaging
- [ ] 複数トリガープロファイル
- [ ] 応答パターンマッチング
- [ ] Webhook通知

## 📄 ライセンス

このプロジェクトはMITライセンスの下でライセンスされています - 詳細は[LICENSE](LICENSE)ファイルを参照してください。

## 🙏 謝辞

- より良いLLMワークフロー自動化の必要性から着想
- Logi Options+ Smart Actionsとの使用を想定して構築
- モダンなブラウザ互換性のためChrome Extension Manifest V3を使用

## 📞 サポート

- **Issues**: https://github.com/yourusername/tailhook/issues
- **Discussions**: https://github.com/yourusername/tailhook/discussions

---

**注意**: リポジトリを公開後、URL内の `yourusername` を実際のGitHubユーザー名に置き換えてください。
