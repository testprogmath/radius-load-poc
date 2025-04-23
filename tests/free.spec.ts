import { beforeAll, describe, expect, test, vi } from 'vitest';
import { execSync } from 'node:child_process';
import { getConfigPath } from '../src/utils.js';
import { free } from '../src/index.js';

let options: { hub: string, email: string };

describe('Test free command', () => {
    beforeAll(async () => {
        const config = await getConfigPath();
        options = {
            hub: config.hubForTests,
            email: config.testEmail,
        };
        console.log("Initialized options:", options);
    });

    test('Free a specified hub', async () => {
        const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

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