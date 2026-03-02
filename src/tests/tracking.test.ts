import { describe, it, expect } from 'vitest';
import { cleanUrl } from '../lib/tracking';

describe('cleanUrl', () => {
    it('should remove default tracking parameters', () => {
        const original = "https://example.com/page?utm_source=test&organic=1";
        const cleaned = cleanUrl(original);
        expect(cleaned).toBe("https://example.com/page?organic=1");
    });

    it('should return null if no tracking parameters are found', () => {
        const original = "https://example.com/page?organic=1&start_radio=1";
        const cleaned = cleanUrl(original);
        expect(cleaned).toBeNull();
    });

    it('should efficiently handle deep links and complex hashes', () => {
        const original = "https://youtu.be/test?si=123#time=10";
        const cleaned = cleanUrl(original);
        expect(cleaned).toBe("https://youtu.be/test#time=10");
    });

    it('should remove custom tracking parameters if provided', () => {
        const original = "https://example.com/page?custom_track=xyz&organic=1";
        const cleaned = cleanUrl(original, ["custom_track"]);
        expect(cleaned).toBe("https://example.com/page?organic=1");
    });

    it('should return null on bad url inputs', () => {
        expect(cleanUrl("not-a-url")).toBeNull();
    });
});
