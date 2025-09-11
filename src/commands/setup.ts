import * as dotenv from "dotenv";
import * as fs from "fs";
import * as path from "path";
import * as readline from "readline";
import * as os from "os";
import {Storage} from "@google-cloud/storage";

dotenv.config({ override: true });

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

export async function setupEnv(): Promise<void> {
    const jsonConfigPath = path.join(os.homedir(), ".flinkord", "config.json");
    const envFilePath = path.join(process.cwd(), ".env");
    const jsonTempPath = path.join(process.cwd(), "env.json");
    const embeddedEnvPath = process.env.FLINKORD_EMBEDDED_ENV_PATH || path.join(process.cwd(), "resources", "env.default.json");

    const managedKeys = [
        "CT_PROJECT_KEY",
        "CT_CLIENT_ID",
        "CT_CLIENT_SECRET",
        "IDENTITY_KEY",
        "GENERIC_PASSWORD",
        "INVENTORY_SERVICE_TOKEN",
        "FIREBASE_API_KEY",
        "AUTH0_CURB_CLIENT_SECRET",
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

    // 3. Load embedded defaults from the image if present
    if (fs.existsSync(embeddedEnvPath)) {
        try {
            const raw = fs.readFileSync(embeddedEnvPath, "utf-8");
            const embedded = JSON.parse(raw);
            for (const key of managedKeys) {
                if (embedded[key] && !finalConfig[key]) {
                    finalConfig[key] = embedded[key];
                }
            }
            console.log(`📦 Loaded embedded defaults from ${embeddedEnvPath}`);
        } catch (e) {
            console.warn("⚠️ Could not parse embedded defaults.");
        }
    }

    // 4. Optionally load config from GCS if ADC is available
    const hasADC = !!process.env.GOOGLE_APPLICATION_CREDENTIALS;
    if (hasADC) {
        console.log("🔑 Attempting to load managed config from GCS (ADC detected)...");
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
    } else {
        console.log("ℹ️ Skipping GCS download (no ADC detected). Run 'gcloud auth application-default login' to enable.");
    }

    // 5. Prompt for any missing values
    for (const key of managedKeys) {
        if (!finalConfig[key]) {
            const defaultValue = process.env[key] ?? "";
            finalConfig[key] = await askQuestion(`Enter ${key}`, defaultValue);
        }
    }

    // 6. Ask user if they want to add Quinyx credentials
    const wantsQuinyx = await askQuestion("Do you want to add Quinyx credentials to manage shifts? (yes/no)", "no");

    if (wantsQuinyx.toLowerCase().startsWith("y")) {
        finalConfig["quinyxHub"] = await askQuestion("Enter Quinyx hub", finalConfig["quinyxHub"] ?? "de_ber_mit2");
        finalConfig["quinyxBadge"] = await askQuestion("Enter Quinyx badge", finalConfig["quinyxBadge"] ?? "10133422");
        finalConfig["quinyxEmail"] = await askQuestion("Enter Quinyx email", finalConfig["quinyxEmail"] ?? "autotest-hubone@goflink.com");
        finalConfig["quinyxPassword"] = await askQuestion("Enter Quinyx password", finalConfig["quinyxPassword"] ?? "password123&");
    } else {
        console.log("ℹ️ Skipped Quinyx configuration");
    }

    // 7. Save final config to ~/.flinkord/config.json
    const configDir = path.dirname(jsonConfigPath);
    if (!fs.existsSync(configDir)) {
        fs.mkdirSync(configDir, { recursive: true });
        console.log(`📁 Created directory ${configDir}`);
    }

    fs.writeFileSync(jsonConfigPath, JSON.stringify(finalConfig, null, 2), "utf-8");
    console.log(`✅ Updated config at ${jsonConfigPath}`);
}
