export function validateLocale(locale: string): string {
    // https://goflink.atlassian.net/wiki/spaces/SD/pages/438370358/Localisation
    const supportedLocales = [
        "en", "de-de", "en-de",
        "de-at", "en-at",
        "nl-nl", "en-nl",
        "fr-fr", "en-fr"
    ];

    const normalizedLocale = locale.toLowerCase();

    if (!supportedLocales.includes(normalizedLocale)) {
        throw new Error(`Invalid locale value: ${locale}. Supported values are ${supportedLocales.join(", ")}.`);
    }
    return normalizedLocale;
}

export function validateCountry(country: string): string {
    const countryToLocaleMap: Record<string, string> = {
        de: "en-de",
        at: "en-at",
        nl: "en-nl",
        fr: "en-fr"
    };

    const normalizedCountry = country.toLowerCase();
    const locale = countryToLocaleMap[normalizedCountry];

    if (!locale) {
        throw new Error(`Invalid country value: ${country}. Supported values are ${Object.keys(countryToLocaleMap).join(", ")}.`);
    }
    return locale;
}

/**
 * Resolves the locale based on the provided options.
 * @param {string | undefined} locale - The locale provided by the user.
 * @param {string | undefined} country - The country provided by the user.
 * @returns {string} - The validated and resolved locale.
 */
export function resolveLocale(locale?: string, country?: string): string {
    if (locale) {
        return validateLocale(locale);
    } else if (country) {
        return validateCountry(country);
    } else {
        return "en-de"; // Default value
    }
}