# 🛡️ Anti-Track v2.0.0

**A blazing-fast, TypeScript-powered Chrome extension that removes UTM tracking identifiers from URLs before a single packet is sent over the network.**

Keep your browsing **cleaner, shorter, and more privacy-focused**.

Anti-Track intercepts navigation natively at the browser core using `declarativeNetRequest`. This ensures tracking tokens never reach their destination and that crucial URL parameters (like YouTube Video IDs) are intelligently preserved.

---

## 🚀 Features

* **Zero-Packet Evasion:** Uses modern Chrome APIs to strip analytics tokens *before* the request even leaves the browser.
* **Dynamic Custom Rules:** Features a glassmorphism settings popup where you can instantly add and block **any custom parameter** you want.
* **Clipboard Sanitization:** Safely strips trackers from URLs copied directly from your webpage, guaranteeing pure links when pasting to friends.
* **Intelligent Querying:** Driven by `URLSearchParams` to ensure critical parameters required by websites never break.
* **Typesafe & Fast:** 100% migrated to strict TypeScript with an optimized `esbuild` pipeline.

---

## 📦 Installation (Unpacked)

Since **Anti-Track** is provided as raw source files and not packaged on the web store, you can install it in Chrome using **Developer Mode → Load Unpacked**:

1. **Clone the repository && Build:**
   ```bash
   git clone https://github.com/ethanleighfellows/anti-track.git
   cd anti-track
   npm install
   npm run build
   ```
2. **Open Chrome** and go to:
   ```
   chrome://extensions/
   ```
3. **Enable Developer mode** (toggle in the top right).
4. Click **Load unpacked**.
5. Select the **`dist/`** directory inside this project folder.
6. Make sure the extension is enabled — you should now see its icon in your toolbar!

---

## ⚙️ How to use the Native Settings UI
Anti-Track goes beyond the static 20 default trackers (like `utm_source`, `si`, `fbclid`). To add your own parameter:
1. Pin the extension to your toolbar.
2. Click the icon to open the Premium Glass UI.
3. Type any parameter (e.g. `session_id`) into the input and click **Block**. Every network request going forward will instantly destroy that parameter!

---

## 📁 Project Structure

```
anti-track/
├── manifest.json      # Chrome Extension manifest
├── rules.json         # Base declarative network rules
├── src/               # TypeScript Source Code
│   ├── background.ts  # Background worker (context menus)
│   ├── content.ts     # Content script (clipboard hijacker)
│   ├── lib/           # Shared tracking utilities
│   ├── popup/         # Dynamic Settings UI
│   └── tests/         # vitest unit tests
├── dist/              # The compiled Extension directory
└── README.md          # This file
```

---

## 📜 License (No Rights to Reproduce)

```
Copyright (c) 2026 Ethan Leigh-Fellows.

All rights reserved.

This software and all associated materials are provided under a strict proprietary license. No rights are granted to reproduce, distribute, modify, reverse engineer, or sublicense this work, in whole or in part, without explicit written permission from the copyright holder.

Unauthorized copying or distribution is strictly prohibited.
```

