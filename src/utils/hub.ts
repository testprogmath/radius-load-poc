import {promptForHub} from "./prompt";
const hubSlugRegex = /\b[a-z]{2}_[a-z]+_[a-z1-9]+\b/;

export async function getValidatedHubSlug(hubSlug?: string) {
    if (!hubSlug) {
        hubSlug = await promptForHub("fr_par_lepe");
    }

    if (!hubSlugRegex.test(hubSlug)) {
        console.log("This hub does not exist!");
        throw new Error("Invalid hub slug");
    }

    return hubSlug;
}