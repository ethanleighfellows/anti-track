# 🛡️ Anti-Track

**A lightweight Chrome extension that automatically removes UTM tracking identifiers from URLs before you visit a page.**
Keep your browsing **cleaner, shorter, and more privacy-focused** — no tracking tokens ever reach the destination URL.

This extension strips common UTM parameters like those added for marketing analytics (e.g., `utm_source`, `utm_medium`, etc.), so links like:

```
https://example.com/page?utm_source=twitter&utm_medium=social
```

become:

```
https://example.com/page
```

---

## 🚀 Features

* **Automatic UTM stripping:** Removes query parameters used for tracking.
* **No backend or cloud processing:** Runs entirely in your browser.
* **Unpacked, editable source:** Developers can modify or extend it freely.
* **Lightweight & focused:** Only removes tracking identifiers — no bloat, no extra permissions.

---

## 🧠 How It Works

Anti-Track listens for URL changes and intercepts visits that contain UTM or similar tracking parameters. It then rewrites those URLs **before navigation** so you never load pages with tracking tokens attached.

> *Note:* This approach is similar to other privacy-oriented extensions that clean URLs automatically before navigation. ([Chrome Web Store][1])

---

## 📦 Installation (Unpacked)

Since **Anti-Track** is provided as raw source files and not packaged, you can install it in Chrome (or any Chromium-based browser) using **Developer Mode → Load Unpacked**:

1. **Clone the repository**

   ```bash
   git clone https://github.com/ethanleighfellows/anti-track.git
   ```
2. **Open Chrome** and go to:

   ```
   chrome://extensions/
   ```
3. **Enable Developer mode** (toggle in the top right).
4. Click **Load unpacked**.
5. Select the root directory of this project (the folder containing `manifest.json`).
6. Make sure the extension is enabled — you should now see its icon in your toolbar.

> Chrome will show a warning for developer mode extensions. This is normal and safe if you trust the source.

---

## 📁 Project Structure

```
anti-track/
├── icons/             # Extension icon assets
├── background.js      # Background script (core tracker)
├── content.js         # Content script to intercept URLs
├── manifest.json      # Chrome Extension manifest
├── LICENSE            # Licensing terms
└── README.md          # This file
```

---

## 🧪 Testing

Once loaded as an unpacked extension:

1. Visit a site with tracking parameters, e.g.:

   ```
   https://youtu.be/watch?v=…?utm_source=test
   ```
2. The tracking identifiers should be stripped before navigation completes.

---

## 📌 Notes

* This extension only strips **URL query parameters** before page load.
* It does **not track or store user data** itself.
* For broader parameter stripping (like social IDs such as `fbclid`, `gclid`, etc.), consider existing extensions that maintain curated lists. ([GitHub][3])

---

## 📜 License (No Rights to Reproduce)

```
Copyright (c) 2025 Ethan Leigh-Fellows.

All rights reserved.

This software and all associated materials are provided under a strict proprietary license. No rights are granted to reproduce, distribute, modify, reverse engineer, or sublicense this work, in whole or in part, without explicit written permission from the copyright holder.

Unauthorized copying or distribution is strictly prohibited.
```

*By installing or using this extension, you agree to abide by the terms of this license.*

---
