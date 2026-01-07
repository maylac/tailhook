# 🪝 Tailhook

**Tailhook** is a Chrome extension that detects when LLM services (like ChatGPT) complete their responses and automatically triggers custom keyboard combinations. Perfect for workflow automation with tools like Logi Options+ Smart Actions.

## 🎯 Features

### Phase 1 (MVP) - Current Version
- ✅ Detects ChatGPT response completion in real-time
- ✅ Triggers configurable key combination (Ctrl+Shift+T)
- ✅ Simple ON/OFF toggle via extension popup
- ✅ Works on both chat.openai.com and chatgpt.com
- ✅ Smart debouncing to avoid false triggers during streaming

### Phase 2 (Planned)
- 🔄 Support for multiple LLM services (Claude, Gemini, etc.)
- 🔄 Customizable key combinations
- 🔄 Advanced settings page
- 🔄 Multiple trigger action profiles

## 🚀 Installation

### From Source (Development)

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/tailhook.git
   cd tailhook
   ```

2. **Generate icon files**
   ```bash
   cd icons
   # Using ImageMagick (recommended)
   convert -background none icon.svg -resize 16x16 icon16.png
   convert -background none icon.svg -resize 48x48 icon48.png
   convert -background none icon.svg -resize 128x128 icon128.png
   ```
   See `icons/ICONS_README.md` for alternative methods.

3. **Load extension in Chrome**
   - Open Chrome and navigate to `chrome://extensions/`
   - Enable "Developer mode" (toggle in top-right corner)
   - Click "Load unpacked"
   - Select the `tailhook` directory
   - The extension icon should appear in your Chrome toolbar

## 📖 Usage

### Basic Usage

1. **Enable the extension**
   - Click the Tailhook icon in Chrome toolbar
   - Ensure the toggle is ON (default)

2. **Use with ChatGPT**
   - Navigate to https://chat.openai.com or https://chatgpt.com
   - Ask ChatGPT a question
   - When the response completes, Tailhook will automatically trigger **Ctrl+Shift+T**

3. **Integrate with Logi Options+**
   - Open Logi Options+ application
   - Navigate to Smart Actions
   - Create a new action triggered by **Ctrl+Shift+T**
   - Configure your desired automation (e.g., switch tabs, run commands, etc.)

### Disabling Temporarily

Click the extension icon and toggle OFF to disable detection without removing the extension.

## 🔧 Technical Details

### How It Works

1. **Content Script** (`src/content.js`)
   - Injects into ChatGPT pages
   - Uses `MutationObserver` to monitor DOM changes
   - Detects when streaming stops based on:
     - Absence of "Stop generating" button
     - No DOM changes for 800ms (debounced)
     - Completion indicators in response area

2. **Background Service Worker** (`src/background.js`)
   - Manages extension lifecycle
   - Handles installation and state initialization

3. **Popup UI** (`src/popup/`)
   - Provides simple ON/OFF toggle
   - Shows current status and configuration
   - Persists state using Chrome Storage API

### Key Combination

By default, Tailhook triggers: **Ctrl + Shift + T**

This can be customized in Phase 2 through the settings page.

### Detection Logic

```
ChatGPT starts streaming → MutationObserver detects DOM changes
                        ↓
              Streaming continues (no action)
                        ↓
        DOM changes stop for 800ms
                        ↓
      Verify "Stop generating" button is gone
                        ↓
         Trigger keyboard event (Ctrl+Shift+T)
```

## ⚠️ Important Notes

### Logi Options+ Compatibility

Chrome extensions can only generate JavaScript keyboard events, not OS-level key presses. **This may not be detected by Logi Options+ Smart Actions.**

**If Logi Options+ doesn't detect the events**, consider these alternatives:

1. **Native Messaging** - Use Chrome Native Messaging API to communicate with a local application that generates OS-level key presses
2. **AutoHotkey/Hammerspoon** - Use automation tools to detect Chrome notifications and trigger actions
3. **WebSocket Server** - Run a local server that receives commands from the extension and triggers OS-level events

We're currently testing browser-level events. If you encounter issues, please open an issue on GitHub.

### ChatGPT DOM Changes

ChatGPT's DOM structure changes frequently. If detection stops working after a ChatGPT update:

1. Open browser console (F12)
2. Look for Tailhook logs: `[Tailhook]`
3. Report the issue with console logs on GitHub

## 🛠️ Development

### Project Structure

```
tailhook/
├── manifest.json           # Extension manifest (Manifest V3)
├── src/
│   ├── content.js         # DOM monitoring and detection logic
│   ├── background.js      # Service worker
│   └── popup/
│       ├── popup.html     # Popup UI
│       ├── popup.css      # Popup styles
│       └── popup.js       # Popup logic
├── icons/
│   ├── icon.svg          # Source icon (vector)
│   ├── icon16.png        # 16x16 icon
│   ├── icon48.png        # 48x48 icon
│   └── icon128.png       # 128x128 icon
├── LICENSE
└── README.md
```

### Configuration

Key settings can be modified in `src/content.js`:

```javascript
const CONFIG = {
  DEBOUNCE_DELAY: 800,        // ms to wait before triggering
  KEY_COMBINATION: {
    key: 'T',
    ctrlKey: true,
    shiftKey: true,
    altKey: false,
    metaKey: false
  }
};
```

### Debugging

Enable verbose logging:

1. Open ChatGPT page
2. Open Developer Console (F12)
3. Look for logs prefixed with `[Tailhook]`

Example logs:
```
[Tailhook] Content script loaded
[Tailhook] Extension enabled: true
[Tailhook] MutationObserver initialized
[Tailhook] Response completion detected
[Tailhook] ✓ Key combination triggered: Ctrl+Shift+T
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit issues or pull requests.

### Roadmap

- [ ] Multi-service support (Claude, Gemini, Perplexity)
- [ ] Custom key combination settings
- [ ] Options page with advanced configuration
- [ ] Native messaging for OS-level key events
- [ ] Multiple trigger profiles
- [ ] Response pattern matching
- [ ] Webhook notifications

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Inspired by the need for better LLM workflow automation
- Built for use with Logi Options+ Smart Actions
- Uses Chrome Extension Manifest V3 for modern browser compatibility

## 📞 Support

- **Issues**: https://github.com/yourusername/tailhook/issues
- **Discussions**: https://github.com/yourusername/tailhook/discussions

---

**Note**: Replace `yourusername` in URLs with your actual GitHub username after publishing the repository.
