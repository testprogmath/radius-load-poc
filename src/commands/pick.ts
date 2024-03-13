import {HubOneApi} from "../api/hub-one-api";
import {Auth0Api} from "../api/auth0-api";
import {spinnerError, spinnerSuccess, stopSpinner, updateSpinnerText} from "../spinner";
import chalk from "chalk";
import {Colors} from "../shared/enums";
import {generateContainerNumber} from "../utils/container";
import {generateShelfId} from "../utils/shelf";
const emojic = require("emojic");
const DEFAULT_CONTAINER_ID = "1a41ghyj"
export async function pick(orderId: string, hubSlug: string) {
    try {
        const countryPrefix: string = hubSlug.slice(0, 2).toUpperCase();
        let containerId = generateContainerNumber(countryPrefix);
        if (containerId == null) {
            console.log(`Container ID generation failed. Will use a default value ${DEFAULT_CONTAINER_ID}`);
            containerId = DEFAULT_CONTAINER_ID
        }
        const shelfId = generateShelfId();
        updateSpinnerText(chalk.hex(Colors.MEXICAN_PINK_DARK)("Processing... \n"), true);
        const hubOneApi = new HubOneApi(new Auth0Api());
        hubOneApi.setHubSlug(hubSlug);
        await hubOneApi.startPickingOrder(orderId);
        await hubOneApi.endPickingOrder(orderId, [], [containerId], [shelfId]);
        spinnerSuccess(`🚀 The order ${orderId} is picked!`);
        console.log(`${emojic.handshake} ${chalk.hex(Colors.LAVENDER_PINK).bold("Handover Details")} ${emojic.handshake}`);
        console.log(`Container id: ${chalk.hex(Colors.THULIAN_PINK).bold(containerId)}`)
        console.log(`Shelf number: ${chalk.hex(Colors.THULIAN_PINK).bold(shelfId)}`)
    } catch (error: any) {
        spinnerError("Error while picking the order. Please see the problem description below");
        stopSpinner();
        if (error.networkError) {
            console.error(error.networkError.message);
        }
        else {
            let errorMessage = error.message || "An unknown error occurred"
            console.error(errorMessage);
        }
    }
}