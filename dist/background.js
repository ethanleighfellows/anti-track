"use strict";
(() => {
  // src/lib/tracking.ts
  var DEFAULT_TRACKING_PARAMS = [
    "utm_source",
    "utm_medium",
    "utm_campaign",
    "utm_term",
    "utm_content",
    "utm_id",
    "utm_source_platform",
    "si",
    "gclid",
    "fbclid",
    "igshid",
    "ttclid",
    "yclid",
    "msclkid",
    "mc_cid",
    "mc_eid",
    "_bta_tid",
    "_bta_c",
    "trk_contact",
    "trk_msg",
    "trk_module",
    "trk_sid"
  ];
  function cleanUrl(urlString, additionalParams = []) {
    try {
      const url = new URL(urlString);
      const originalSearch = url.search;
      const allParamsToStrip = [...DEFAULT_TRACKING_PARAMS, ...additionalParams];
      for (const param of allParamsToStrip) {
        url.searchParams.delete(param);
      }
      if (url.search !== originalSearch) {
        return url.toString();
      }
      return null;
    } catch (e) {
      return null;
    }
  }

  // src/background.ts
  chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
      id: "clean-copy-link",
      title: "Copy cleaned link",
      contexts: ["link", "page"]
    });
  });
  chrome.contextMenus.onClicked.addListener(async (info, tab) => {
    if (info.menuItemId === "clean-copy-link" && tab?.id) {
      const targetUrl = info.linkUrl || info.pageUrl;
      if (targetUrl) {
        const storage = await chrome.storage.local.get("customParams");
        const customParams = storage.customParams || [];
        const cleaned = cleanUrl(targetUrl, customParams) || targetUrl;
        chrome.scripting.executeScript({
          target: { tabId: tab.id },
          func: (textToCopy) => {
            navigator.clipboard.writeText(textToCopy).catch((err) => {
              console.error("AntiTrack: Failed to copy to clipboard", err);
            });
          },
          args: [cleaned]
        });
      }
    }
  });
})();
