import {promptForHub} from "./prompt";
import {QuinyxGroup} from "../shared/enums";
const hubSlugRegex = /\b[a-z]{2}_[a-z]+_[a-z1-9]+\b/;

export async function getValidatedHubSlug(hubSlug?: string) {
    if (!hubSlug) {
        hubSlug = await promptForHub("de_ham_wint");
    }

    if (!hubSlugRegex.test(hubSlug)) {
        console.log("This hub does not exist!");
        throw new Error("Invalid hub slug");
    }

    return hubSlug;
}

interface HubInfo {
    id: QuinyxGroup;
    description: string;
}
export const hubMap: { [key: string]: HubInfo } = {
    "de_ber_mit1": { id: QuinyxGroup.DE_BER_MIT1, description: "DE - Berlin - Mitte" },
    "de_ber_mit2": { id: QuinyxGroup.DE_BER_MIT2, description: "DE - Berlin - Mitte 2" },
    "de_ber_temp": { id: QuinyxGroup.DE_BER_TEMP, description: "DE - Berlin - Tempelhof" },
    "de_ham_wint": { id: QuinyxGroup.DE_HAM_WINT, description: "DE - Hamburg - Winterhude" },
    "settings_unit": { id: QuinyxGroup.SETTINGS_UNIT, description: "Settings Unit" }
};