import { Storage } from "@google-cloud/storage";
import * as fs from "fs";
import * as path from "path";

const envPath = path.resolve(process.cwd(), "env.json");

async function downloadEnvJsonIfNeeded() {
    const isCI = process.env.CI === "true";
    if (isCI) return;

    const storage = new Storage();
    const bucketName = "flinkord-cli-configs";
    const srcFilename = "env.json";

    try {
        await storage.bucket(bucketName).file(srcFilename).download({ destination: envPath });
        console.log(`📥 Downloaded env.json from GCS to ${envPath}`);
    } catch (error) {
        // @ts-ignore
        console.warn("⚠️ Could not download env.json from GCS:", error.message);
    }
}

export async function loadEnvFromJson() {
    await downloadEnvJsonIfNeeded();
    if (!fs.existsSync(envPath)) {
        console.warn("⚠️ env.json not found. Skipping env injection.");
        return;
    }

    const raw = fs.readFileSync(envPath, "utf-8");
    const parsed = JSON.parse(raw);

    for (const [key, value] of Object.entries(parsed)) {
        if (!process.env[key]) {
            process.env[key] = String(value);
        }
    }

    console.log("✅ Environment variables loaded from env.json");
}