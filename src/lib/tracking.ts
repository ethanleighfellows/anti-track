/**
 * Shared tracking parameters array that matches the declarativeNetRequest rules.
 */
export const DEFAULT_TRACKING_PARAMS = [
    "utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content", "utm_id", "utm_source_platform",
    "si", "gclid", "fbclid", "igshid", "ttclid", "yclid", "msclkid", "mc_cid", "mc_eid",
    "_bta_tid", "_bta_c", "trk_contact", "trk_msg", "trk_module", "trk_sid"
];

/**
 * Parses a URL string and removes specified tracking query parameters.
 * Retains parameters not defined in the tracking array.
 * 
 * @param urlString - The raw string URL to sanitize.
 * @param additionalParams - An optional array of custom parameters to strip.
 * @returns The sanitized URL string if changed, or null if no parameters were matched/invalid URL.
 */
export function cleanUrl(urlString: string, additionalParams: string[] = []): string | null {
    try {
        const url = new URL(urlString);
        const originalSearch = url.search;
        const allParamsToStrip = [...DEFAULT_TRACKING_PARAMS, ...additionalParams];

        for (const param of allParamsToStrip) {
            url.searchParams.delete(param);
        }

        // Only return the new string if it actually changed
        if (url.search !== originalSearch) {
            return url.toString();
        }
        return null;
    } catch (e) {
        return null;
    }
}
