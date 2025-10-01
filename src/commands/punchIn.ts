import { PunchApi, TimepunchTooLateError } from "../api/punch-api.js";
import { spinnerError, spinnerSuccess, updateSpinnerText, printErrorAndStopSpinner } from "../spinner.js";
import { getValidatedHubSlug } from "../utils/hub.js";
import { loadMergedConfig } from "../loadMergedConfig.js";
import chalk from "chalk";
import { Colors } from "../shared/enums.js";
//@ts-ignore
import emojic from "emojic";

interface HubPunchConfig {
    customerId: string;
    unitId: string;
    restId: string;
}

const HUB_PUNCH_CONFIG = {
    "de_ber_mit2": {
        customerId: "5799",
        unitId: "60581",
        restId: "60581"
    },
    "de_ber_temp": {
        customerId: "5799",
        unitId: "60581",
        restId: "60581"
    }
} as Record<string, HubPunchConfig>;

export async function punchIn(hubSlug?: string, badgeNumber?: string, username?: string, password?: string, reason?: string): Promise<void> {
    try {
        updateSpinnerText("Initializing punch system...", true);

        const validatedHubSlug = await getValidatedHubSlug(hubSlug);

        if (!badgeNumber) {
            throw new Error("Badge number is required for punch-in operation");
        }

        const config = loadMergedConfig();
        const hubConfig = HUB_PUNCH_CONFIG[validatedHubSlug];
        
        if (!hubConfig) {
            throw new Error(`Punch configuration not found for hub: ${validatedHubSlug}. Please contact administrator to configure punch parameters.`);
        }

        const punchApi = new PunchApi();

        updateSpinnerText("Logging into punch system...", true);

        let webpunchUsername = username;
        let webpunchPassword = password;
        
        if (!webpunchUsername || !webpunchPassword) {
            webpunchUsername = config.quinyxEmail;
            webpunchPassword = config.quinyxPassword;
        }
        
        if (!webpunchUsername || !webpunchPassword) {
            throw new Error("Webpunch username and password are required. Use --username and --password options or configure Quinyx credentials.");
        }
        
        const loginResponse = await punchApi.login(webpunchUsername, webpunchPassword);
        const userInfo = loginResponse.manager;
        
        if (badgeNumber && userInfo.e_badge_no !== badgeNumber) {
            console.log(`Warning: Login badge (${userInfo.e_badge_no}) doesn't match requested badge (${badgeNumber}). Using login badge.`);
            badgeNumber = userInfo.e_badge_no;
        }

        updateSpinnerText("Executing punch-in...", true);

        try {
            const webcamImage = '/9j/4AAQSkZJRgABAQAASABIAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k=';
            
            await punchApi.punch(
                hubConfig.restId,
                hubConfig.customerId,
                badgeNumber,
                'PUNCH_IN',
                webcamImage,
                reason
            );
        } catch (punchError: any) {
            if (punchError instanceof TimepunchTooLateError) {
                if (reason) {
                    throw punchError;
                } else {
                    process.stdout.write('\n');
                    console.log(`⚠️  ${chalk.yellow('Punch is too late and requires a reason.')}`);
                    console.log(`To force the punch, run the command again with the --reason option:`);
                    console.log(`${chalk.cyan(`flinkord punch_in --hub ${validatedHubSlug} --badge ${badgeNumber} --username "${webpunchUsername}" --password "${webpunchPassword}" --reason "Your reason here"`)}`);
                    throw new Error('Punch cancelled: Late punch requires a reason. Use --reason option to force.');
                }
            }
            throw punchError;
        }

        spinnerSuccess(`${emojic.clockwise} Successfully punched in!`);

        console.log(`\n${emojic.bust_in_silhouette} ${chalk.hex(Colors.LAVENDER_PINK).bold("Employee Details")} ${emojic.bust_in_silhouette}`);
        console.log(`Badge Number: ${chalk.hex(Colors.THULIAN_PINK).bold(badgeNumber)}`);
        console.log(`Hub: ${chalk.hex(Colors.THULIAN_PINK).bold(validatedHubSlug)}`);
        console.log(`Customer ID: ${chalk.hex(Colors.THULIAN_PINK).bold(hubConfig.customerId)}`);
        console.log(`Unit ID: ${chalk.hex(Colors.THULIAN_PINK).bold(hubConfig.unitId)}`);

        if (userInfo && typeof userInfo === 'object') {
            console.log(`\n${emojic.information_source} ${chalk.hex(Colors.LAVENDER_PINK).bold("Additional Info")}`);
            Object.entries(userInfo).forEach(([key, value]) => {
                if (typeof value === 'string' || typeof value === 'number') {
                    console.log(`${key}: ${chalk.hex(Colors.THULIAN_PINK).bold(String(value))}`);
                }
            });
        }

    } catch (error: any) {
        if (error.response?.status === 409) {
            spinnerError("Punch has already been completed for this time period. No duplicate punch allowed.");
            process.exit(1);
        } else if (error instanceof TimepunchTooLateError) {
            spinnerError(error.message);
            process.exit(1);
        } else if (error.message) {
            spinnerError(error.message);
            process.exit(1);
        } else {
            printErrorAndStopSpinner(error);
        }
    }
}