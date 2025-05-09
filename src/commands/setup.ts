import * as dotenv from "dotenv";
dotenv.config();

import * as fs from "fs";
import * as path from "path";
import * as readline from "readline";
import * as os from "os";
import { Storage } from "@google-cloud/storage";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

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
        fs.writeFileSync(filePath, content);
        console.log(".env file successfully written");
    } catch (err) {
        console.error("Failed to write to .env file:", err);
    }
}

async function downloadConfigFromGCS(bucketName: string, srcFilename: string, destPath: string): Promise<void> {
    const storage = new Storage();
    const bucket = storage.bucket(bucketName);
    const file = bucket.file(srcFilename);

    try {
        await file.download({ destination: destPath });
        console.log(`✅ Downloaded ${srcFilename} from GCS to ${destPath}`);
    } catch (error) {
        if ((error as any)?.response?.data?.error === 'invalid_grant') {
            console.error(`❌ Failed to authenticate with Google Cloud: invalid_grant.
➡ Try running: gcloud auth application-default login`);
        } else {
            console.error(`❌ Failed to download ${srcFilename} from GCS:`, error);
        }    }
}

export function writeFproxyConfig(): void {
    const projectRoot = join(__dirname, "..", "..", "..");
    const templatePath = join(projectRoot, "templates", "fproxy.yaml");
    const fproxyYamlPath = join(os.homedir(), "fproxy.yaml");

    try {
        if (!fs.existsSync(templatePath)) {
            console.error("❌ fproxy.yaml template not found in templates directory.");
            return;
        }

        const yamlContent = fs.readFileSync(templatePath, "utf-8");

        if (!fs.existsSync(fproxyYamlPath)) {
            fs.writeFileSync(fproxyYamlPath, yamlContent);
            console.log("✅ Created fproxy.yaml in home directory");
        } else {
            console.log("ℹ️ fproxy.yaml already exists, skipping creation");
        }
    } catch (err) {
        console.error("❌ Failed to write fproxy.yaml:", err);
    }
}

export async function setupEnv(): Promise<void> {
    const envFilePath = path.join(process.cwd(), ".env");
    const jsonTempPath = path.join(process.cwd(), "env.json");
    let existingEnv: Record<string, string> = {};

    const managedKeys = [
        "CT_PROJECT_KEY",
        "CT_CLIENT_ID",
        "CT_CLIENT_SECRET",
        "IDENTITY_KEY",
        "GENERIC_PASSWORD",
        "INVENTORY_SERVICE_TOKEN",
        "FIREBASE_API_KEY"
    ];

    // Step 1: Load existing .env values if present
    if (fs.existsSync(envFilePath)) {
        const raw = fs.readFileSync(envFilePath, "utf-8");
        for (const line of raw.split("\n")) {
            const [key, val] = line.split("=");
            if (key && val) {
                existingEnv[key.trim()] = val.trim().replace(/^"|"$/g, ""); // remove surrounding quotes
            }
        }
    }

    // Step 2: Download from GCS and merge managed keys
    await downloadConfigFromGCS("flinkord-cli-configs", "env.json", jsonTempPath);

    if (fs.existsSync(jsonTempPath)) {
        const raw = fs.readFileSync(jsonTempPath, "utf-8");
        const config = JSON.parse(raw);
        fs.unlinkSync(jsonTempPath); // cleanup

        for (const key of managedKeys) {
            if (key in config) {
                existingEnv[key] = config[key];
            }
        }

        const content = Object.entries(existingEnv)
            .map(([key, value]) => `${key}="${value}"`)
            .join("\n");

        writeEnvFile(envFilePath, content + "\n");
        return;
    }

    // Step 3: Prompt if download failed or incomplete
    const defaultClientId = process.env.CT_CLIENT_ID ?? "";
    const defaultClientSecret = process.env.CT_CLIENT_SECRET ?? "";
    const identityKey = process.env.IDENTITY_KEY ?? "";
    const genericPassword = process.env.GENERIC_PASSWORD ?? "";
    const inventoryServiceToken = process.env.INVENTORY_SERVICE_TOKEN ?? "";
    const firebaseApiKey = process.env.FIREBASE_API_KEY ?? "";

    try {
        const clientId = await askQuestion("Enter CT_CLIENT_ID", defaultClientId);
        const clientSecret = await askQuestion("Enter CT_CLIENT_SECRET", defaultClientSecret);
        const identityKeySecret = await askQuestion("Enter IDENTITY_KEY", identityKey);

        existingEnv["CT_PROJECT_KEY"] = "flink-staging";
        existingEnv["CT_CLIENT_ID"] = clientId;
        existingEnv["CT_CLIENT_SECRET"] = clientSecret;
        existingEnv["IDENTITY_KEY"] = identityKeySecret;
        existingEnv["GENERIC_PASSWORD"] = genericPassword;
        existingEnv["INVENTORY_SERVICE_TOKEN"] = inventoryServiceToken;
        existingEnv["FIREBASE_API_KEY"] = firebaseApiKey;

        const content = Object.entries(existingEnv)
            .map(([key, value]) => `${key}="${value}"`)
            .join("\n");

        writeEnvFile(envFilePath, content + "\n");
        writeFproxyConfig();
    } catch (error) {
        console.error("An error occurred during setup:", error);
    }
}