export function generateContainerNumber(countryCode: string, sizeDigit: 1 | 2 | 3 = 1): string | null {
    const countryDigits: Record<string, string> = {
        "DE": "1",
        "NL": "2",
        "FR": "3"
    };
    if (!countryDigits[countryCode.toUpperCase()]) {
        console.error("Invalid country code. Allowed codes are DE, NL, and FR.");
        return null;
    }
    const randomAlpha = (): string => String.fromCharCode(65 + Math.floor(Math.random() * 26));
    const randomAlphaNum = (): string => Math.random().toString(36).charAt(2).toUpperCase();
    const countryDigit = countryDigits[countryCode];
    const sizeDigitStr = sizeDigit.toString();
    const randomAlphaNumStr = randomAlphaNum() + randomAlphaNum() + randomAlphaNum() + randomAlphaNum();

    return `${countryDigit}${randomAlpha()}${randomAlphaNum()}${sizeDigitStr}${randomAlphaNumStr}`;
}