import { cleanUrl } from "./lib/tracking";

// Service Worker for Context Menus

chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
        id: 'clean-copy-link',
        title: "Copy cleaned link",
        contexts: ['link', 'page']
    });
});

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
    if (info.menuItemId === 'clean-copy-link' && tab?.id) {
        const targetUrl = info.linkUrl || info.pageUrl;
        if (targetUrl) {
            // Future-proof: fetch custom params from storage before cleaning
            const storage = await chrome.storage.local.get("customParams");
            const customParams: string[] = storage.customParams || [];
            const cleaned = cleanUrl(targetUrl, customParams) || targetUrl; // Fallback to orig

            chrome.scripting.executeScript({
                target: { tabId: tab.id },
                func: (textToCopy: string) => {
                    navigator.clipboard.writeText(textToCopy).catch(err => {
                        console.error("AntiTrack: Failed to copy to clipboard", err);
                    });
                },
                args: [cleaned]
            });
        }
    }
});
