import { HubOneApi } from "../api/hub-one-api.js";
import { Auth0Api } from "../api/auth0-api.js";
import { spinnerError, spinnerSuccess, stopSpinner, updateSpinnerText } from "../spinner.js";
import chalk from "chalk";
import { Colors } from "../shared/enums.js";
import { generateContainerNumber } from "../utils/container.js";
import { generateShelfId } from "../utils/shelf.js";
//@ts-ignore
import emojic from "emojic";

const DEFAULT_CONTAINER_ID = "1a41ghyj";

function getContainerId(hubSlug: string): string {
    const countryPrefix = hubSlug.slice(0, 2).toUpperCase();
    const containerId = generateContainerNumber(countryPrefix);
    if (!containerId) {
        console.warn(`Container ID generation failed. Using default value: ${DEFAULT_CONTAINER_ID}`);
        return DEFAULT_CONTAINER_ID;
    }
    return containerId;
}

export async function pick(orderId: string, hubSlug: string): Promise<void> {
    const containerId = getContainerId(hubSlug);
    const shelfId = generateShelfId();

    updateSpinnerText(chalk.hex(Colors.MEXICAN_PINK_DARK)("Processing... \n"), true);

    try {
        const hubOneApi = new HubOneApi(new Auth0Api());
        hubOneApi.setHubSlug(hubSlug);

        await hubOneApi.startPickingOrder(orderId);
        await hubOneApi.endPickingOrder(orderId, [], [containerId], [shelfId]);

        spinnerSuccess(`🚀 The order ${orderId} is picked!`);

        console.log(`${emojic.handshake} ${chalk.hex(Colors.LAVENDER_PINK).bold("Handover Details")} ${emojic.handshake}`);
        console.log(`Container ID: ${chalk.hex(Colors.THULIAN_PINK).bold(containerId)}`);
        console.log(`Shelf Number: ${chalk.hex(Colors.THULIAN_PINK).bold(shelfId)}`);
    } catch (error: unknown) {
        spinnerError("Error while picking the order. Please see the problem description below");
        stopSpinner();

        if (error instanceof Error) {
            console.error(error.message);
        } else {
            console.error("An unknown error occurred");
        }
    }
}