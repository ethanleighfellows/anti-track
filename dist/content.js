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

  // src/content.ts
  document.addEventListener("copy", async (e) => {
    const selection = window.getSelection()?.toString().trim() || "";
    if (/^https?:\/\/[^\s]+$/.test(selection)) {
      const storage = await chrome.storage.local.get("customParams");
      const customParams = storage.customParams || [];
      const cleanedUrl = cleanUrl(selection, customParams);
      if (cleanedUrl && e.clipboardData) {
        e.preventDefault();
        e.clipboardData.setData("text/plain", cleanedUrl);
      }
    }
  });
})();
