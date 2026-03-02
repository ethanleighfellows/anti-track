import { cleanUrl } from "./lib/tracking";

// Intercept copy events to strip tracking parameters from URLs

document.addEventListener('copy', async (e: ClipboardEvent) => {
    const selection = window.getSelection()?.toString().trim() || "";

    // Only attempt to clean if the entire selection looks like a single URL.
    // We avoid modifying selections that start with a URL but contain other text.
    if (/^https?:\/\/[^\s]+$/.test(selection)) {
        // Fetch user dynamic params
        const storage = await chrome.storage.local.get("customParams");
        const customParams: string[] = storage.customParams || [];

        const cleanedUrl = cleanUrl(selection, customParams);

        if (cleanedUrl && e.clipboardData) {
            e.preventDefault();
            e.clipboardData.setData('text/plain', cleanedUrl);
        }
    }
});
