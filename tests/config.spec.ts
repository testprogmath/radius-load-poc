import { describe, it, expect, vi, beforeEach } from "vitest";
import type { Mock } from "vitest";
import { printConfig } from "./../src/commands/config.js";
import * as utils from "../src/utils.js";
import {AppConfig} from "../src/config.js";

vi.mock("fs", () => {
    return {
        existsSync: vi.fn() as Mock,
        readFileSync: vi.fn() as Mock,
    };
});

const fs = await import("fs");

// console + process mocks
const logSpy = vi.spyOn(console, "log").mockImplementation(() => {});
const dirSpy = vi.spyOn(console, "dir").mockImplementation(() => {});
const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
const exitSpy = vi.spyOn(process, "exit").mockImplementation(() => {
    throw new Error("EXIT");
});

const mockConfig: AppConfig = {
    consumerApiUrl: "https://consumer.fake",
    hubManagerApiUrl: "https://hub-manager.fake",
    hubApiUrl: "https://hub-api.fake",
    CTAuthUrl: "https://ct-auth.fake",
    CTApiUrl: "https://ct-api.fake",
    hubForTests: "amsterdam",
    testEmail: "test@example.com",
    hubApiKey: "fake-hub-api-key",
    identityToolkitUrl: "https://identity-toolkit.fake",
    instoreLogin: "test-login",
    instorePassword: "test-password",
    quinyxUrl: "https://quinyx.fake",
    inventoryServiceUrl: "https://inventory.fake",
    genericPassword: "very-secret",
    firebaseUrl: "https://firebase.fake",
};

describe("printConfig", () => {
    beforeEach(() => {
        vi.resetAllMocks();
    });

    it("should print config with masked env variables", async () => {
        vi.spyOn(utils, "getConfigPath").mockResolvedValue(mockConfig);
        (fs.existsSync as unknown as Mock).mockReturnValue(true);
        (fs.readFileSync as unknown as Mock).mockReturnValue(`FIREBASE_API_KEY="MySuperSecret"\nHUB=berlin\nPASSWORD=12345678`);

        await printConfig();

        expect(logSpy).toHaveBeenCalledWith("Current configuration:");
        expect(dirSpy).toHaveBeenCalledWith(
            {
                configJson: mockConfig,
                env: {
                    FIREBASE_API_KEY: "MySu...cret",
                    HUB: "berlin",
                    PASSWORD: "***",
                },
            },
            expect.anything()
        );
    });

    it("should work if .env does not exist", async () => {
        vi.spyOn(utils, "getConfigPath").mockResolvedValue(mockConfig);
        (fs.readFileSync as unknown as Mock).mockReturnValue(false);

        await printConfig();

        expect(logSpy).toHaveBeenCalledWith("Current configuration:");
        expect(dirSpy).toHaveBeenCalledWith(
            {
                configJson: mockConfig,
                env: {},
            },
            expect.anything()
        );
    });

    it("should handle getConfigPath error", async () => {
        vi.spyOn(utils, "getConfigPath").mockRejectedValue(new Error("fail"));
        await expect(printConfig()).rejects.toThrow('process.exit unexpectedly called with "1"');
        expect(errorSpy).toHaveBeenCalledWith("Failed to load configuration:", "fail");
    });
});