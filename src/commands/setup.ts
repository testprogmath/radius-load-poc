import * as fs from 'fs';
import * as path from 'path';
import * as readline from 'readline';

export async function setupEnv(): Promise<void> {
    const envFilePath = path.join(process.cwd(), '.env');

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    const defaultClientId = 'wxgadKVe9YfVkHWUDhgpIIJ6';
    const defaultClientSecret = '0WFvnrfs44KGFKLMwfCB7uXvFyq8Fyoi';
    const identityKey = 'AIzaSyB9qXJLdHcG2jG4Syixq4GiY8sgYaE1H88';
    const genericPassword = "password123&";

    const clientId = await new Promise<string>((resolve) => {
        rl.question(`Enter CT_CLIENT_ID (default: ${defaultClientId}): `, (inputClientId) => {
            resolve(inputClientId || defaultClientId);
        });
    });

    const clientSecret = await new Promise<string>((resolve) => {
        rl.question(`Enter CT_CLIENT_SECRET (to use the default value, press enter): `, (inputClientSecret) => {
            resolve(inputClientSecret || defaultClientSecret);
        });
    });

    const identityKeySecret = await new Promise<string>((resolve) => {
        rl.question(`Enter IDENTITY_KEY (to use the default value, press enter): `, (identityKeyValue) => {
            resolve(identityKeyValue || identityKey);
        });
    });

    const envFileContent = `CT_PROJECT_KEY="flink-staging"
CT_CLIENT_ID="${clientId}"
CT_CLIENT_SECRET="${clientSecret}"
IDENTITY_KEY="${identityKeySecret}"
GENERIC_PASSWORD="${genericPassword}"
`;

    fs.writeFile(envFilePath, envFileContent, (err) => {
        if (err) {
            console.error('Failed to create .env file:', err);
        } else {
            console.log('.env file successfully created');
        }
        rl.close();
    });
}
