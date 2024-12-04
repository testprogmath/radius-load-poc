import {describe, expect, test} from '@jest/globals';
import { jest } from '@jest/globals';

import {execSync} from "child_process";
import {getConfigPath} from "../src/utils.js";
import {free} from "../src/index.js";

let options : {hub: string, email: string};

describe('Test free command', () => {
    jest.retryTimes(3, {logErrorsBeforeRetry: true});
    beforeAll(async () => {
        const config = await getConfigPath();
        options = {
            hub: config.hubForTests,
            email: config.testEmail,
        };
        console.log("Initialized options:", options);
    });
    test('Free a specified hub', async () => {
        const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

        if (!options.hub) {
            throw new Error("Hub is not specified in the configuration");
        }

        await free(options.hub);

        expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('"statusCode":200'));
        consoleSpy.mockRestore();
    });

    test('CLI: Hub should be specified for free command', async () => {
        await expect(async () => {
            const output = execSync(`flinkord free`).toString();
            console.log(output);
            expect(output).toContain(`error: required option '-h, --hub <hub_slug>' not specified`);
        }).rejects.toThrow();
    });
});
