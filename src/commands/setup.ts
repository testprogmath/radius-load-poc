import * as dotenv from "dotenv";
dotenv.config();

import * as fs from "fs";
import * as path from "path";
import * as readline from "readline";

async function askQuestion(question: string, defaultValue?: string): Promise<string> {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    const promptText = defaultValue
        ? `${question} (default: ${defaultValue}): `
        : `${question}: `;

    return new Promise((resolve) => {
        rl.question(promptText, (answer) => {
            rl.close();
            resolve(answer || defaultValue || "");
        });
    });
}

function writeEnvFile(filePath: string, content: string): void {
    try {
        if (fs.existsSync(filePath)) {
            fs.appendFileSync(filePath, content);
            console.log(".env file successfully updated");
        } else {
            fs.writeFileSync(filePath, content);
            console.log(".env file successfully created");
        }
    } catch (err) {
        console.error("Failed to write to .env file:", err);
    }
}

export async function setupEnv(): Promise<void> {
    const envFilePath = path.join(process.cwd(), ".env");

    const defaultClientId = process.env.CT_CLIENT_ID ?? "";
    const defaultClientSecret = process.env.CT_CLIENT_SECRET ?? "";
    const identityKey = process.env.IDENTITY_KEY ?? "";
    const genericPassword = process.env.GENERIC_PASSWORD ?? "";

    try {
        const clientId = await askQuestion("Enter CT_CLIENT_ID", defaultClientId);
        const clientSecret = await askQuestion("Enter CT_CLIENT_SECRET (press enter to use default)", defaultClientSecret);
        const identityKeySecret = await askQuestion("Enter IDENTITY_KEY (press enter to use default)", identityKey);

        const envFileContent = `CT_PROJECT_KEY="flink-staging"
CT_CLIENT_ID="${clientId}"
CT_CLIENT_SECRET="${clientSecret}"
IDENTITY_KEY="${identityKeySecret}"
GENERIC_PASSWORD="${genericPassword}"
`;

        writeEnvFile(envFilePath, envFileContent);
    } catch (error) {
        console.error("An error occurred during setup:", error);
    }
}