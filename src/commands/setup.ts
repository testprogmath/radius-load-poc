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
    const jsonConfigPath = path.join(os.homedir(), ".flinkord", "config.json");
    const envFilePath = path.join(process.cwd(), ".env");
    const jsonTempPath = path.join(process.cwd(), "env.json");

    const managedKeys = [
        "CT_PROJECT_KEY",
        "CT_CLIENT_ID",
        "CT_CLIENT_SECRET",
        "IDENTITY_KEY",
        "GENERIC_PASSWORD",
        "INVENTORY_SERVICE_TOKEN",
        "FIREBASE_API_KEY"
    ];

    let finalConfig: Record<string, any> = {};

    // 1. Load existing ~/.flinkord/config.json if it exists
    if (fs.existsSync(jsonConfigPath)) {
        try {
            const raw = fs.readFileSync(jsonConfigPath, "utf-8");
            finalConfig = JSON.parse(raw);
            console.log(`🛠 Loaded existing config from ${jsonConfigPath}`);
        } catch (e) {
            console.warn("⚠️ Could not parse existing config. Starting fresh.");
        }
    }

    // 2. Load .env file for backward compatibility
    if (fs.existsSync(envFilePath)) {
        const raw = fs.readFileSync(envFilePath, "utf-8");
        for (const line of raw.split("\n")) {
            const [key, val] = line.split("=");
            if (key && val) {
                finalConfig[key.trim()] = val.trim().replace(/^"|"$/g, "");
            }
        }
        console.log("✅ Loaded config from .env");
    }

    // 3. Try to load config from GCS
    await downloadConfigFromGCS("flinkord-cli-configs", "env.json", jsonTempPath);
    if (fs.existsSync(jsonTempPath)) {
        const raw = fs.readFileSync(jsonTempPath, "utf-8");
        const remote = JSON.parse(raw);
        fs.unlinkSync(jsonTempPath);

        for (const key of managedKeys) {
            if (remote[key]) {
                finalConfig[key] = remote[key];
            }
        }

        console.log("✅ Loaded config from GCS");
    }

    // 4. Prompt for any missing values
    for (const key of managedKeys) {
        if (!finalConfig[key]) {
            const defaultValue = process.env[key] ?? "";
            const answer = await askQuestion(`Enter ${key}`, defaultValue);
            finalConfig[key] = answer;
        }
    }

    // 5. Ask user if they want to add Quinyx credentials
    const wantsQuinyx = await askQuestion("Do you want to add Quinyx credentials to manage shifts? (yes/no)", "no");

    if (wantsQuinyx.toLowerCase().startsWith("y")) {
        finalConfig["quinyxHub"] = await askQuestion("Enter Quinyx hub", finalConfig["quinyxHub"] ?? "de_ber_mit2");
        finalConfig["quinyxBadge"] = await askQuestion("Enter Quinyx badge", finalConfig["quinyxBadge"] ?? "10133422");
        finalConfig["quinyxEmail"] = await askQuestion("Enter Quinyx email", finalConfig["quinyxEmail"] ?? "autotest-hubone@goflink.com");
        finalConfig["quinyxPassword"] = await askQuestion("Enter Quinyx password", finalConfig["quinyxPassword"] ?? "password123&");
        finalConfig["quinyxShiftType"] = await askQuestion("Enter Quinyx shift type (e.g. OPS_ASSOCIATE)", finalConfig["quinyxShiftType"] ?? "OPS_ASSOCIATE");
    } else {
        console.log("ℹ️ Skipped Quinyx configuration");
    }

    // 6. Save final config to ~/.flinkord/config.json
    const configDir = path.dirname(jsonConfigPath);
    if (!fs.existsSync(configDir)) {
        fs.mkdirSync(configDir, { recursive: true });
        console.log(`📁 Created directory ${configDir}`);
    }

    fs.writeFileSync(jsonConfigPath, JSON.stringify(finalConfig, null, 2), "utf-8");
    console.log(`✅ Updated config at ${jsonConfigPath}`);

    // 7. Create fproxy.yaml as usual
    writeFproxyConfig();
}