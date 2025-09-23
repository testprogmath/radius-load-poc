import {promptForHub} from "./prompt.js";
import {QuinyxGroup} from "../shared/enums.js";
import {Hubs} from "../shared/hubs.js";

const hubSlugRegex = /\b[a-z]{2}_[a-z]+_[a-z1-9]+\b/;

export async function getValidatedHubSlug(hubSlug?: string) {
    if (!hubSlug) {
        hubSlug = await promptForHub("de_ber_temp");
    }

    if (!hubSlugRegex.test(hubSlug)) {
        throw new Error("Invalid hub slug format");
    }

    if (!hubMap[hubSlug] && !Hubs[hubSlug]) {
        throw new Error("This hub does not exist!");
    }

    return hubSlug;
}

interface HubInfo {
    id: QuinyxGroup;
    description: string;
}

export const hubMap: { [key: string]: HubInfo } = {
    "de_ber_mit1": {id: QuinyxGroup.DE_BER_MIT1, description: "DE - Berlin - Mitte"},
    "de_ber_mit2": {id: QuinyxGroup.DE_BER_MIT2, description: "DE - Berlin - Mitte 2"},
    "de_ber_temp": {id: QuinyxGroup.DE_BER_TEMP, description: "DE - Berlin - Tempelhof"},
    "de_ber_wedd": {id: QuinyxGroup.DE_BER_WEDD, description: "DE - Berlin - Wedding"},
    "de_ham_wate": {id: QuinyxGroup.DE_HAM_WATE, description: "DE - Hamburg - Waterloohain"},
    "settings_unit": {id: QuinyxGroup.SETTINGS_UNIT, description: "Settings Unit"}
};