import {describe, expect, test} from '@jest/globals';

const {execSync} = require('child_process');
const config = require('config');
const options = {
    hub: config.get("hubForTests"),
    email: config.get("testEmail")
};

describe('Test free command', () => {
    jest.retryTimes(3, {logErrorsBeforeRetry: true});
    test('CLI: Free a specified hub', async () => {
        const output = execSync(`flinkord free -h ${options.hub}`).toString();
        console.log(output);
        expect(output).toContain(`"statusCode":200`);
    });

    test('CLI: Hub should be specified for free command', async () => {
        await expect(async () => {
            const output = execSync(`flinkord free`).toString();
            console.log(output);
            expect(output).toContain(`error: required option '-h, --hub <hub_slug>' not specified`);
        }).rejects.toThrow();
    });
});
