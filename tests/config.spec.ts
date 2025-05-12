import { describe, it, expect, vi, beforeEach } from "vitest";
import * as utils from "../src/utils.js";
import { printConfig } from "../src/commands/config.js";

vi.mock("fs", () => ({
    existsSync: vi.fn(),
    readFileSync: vi.fn(),
}));

vi.mock("os", () => ({
    homedir: () => "/fake-home",
}));

vi.mock("path", async () => {
    const path = await vi.importActual("path") as any;
    return {
        ...path,
        join: (...parts: string[]) => parts.join("/"),
    };
});

vi.mock("../src/loadMergedConfig.js", () => ({
    loadMergedConfig: vi.fn(() => ({
        consumerApiUrl: "https://consumer.fake",
        firebaseUrl: "https://firebase.fake",
        quinyxPassword: "super-secret",
    })),
}));

vi.mock("../src/utils.js", () => ({
    getConfigFilePath: vi.fn(() => "/config/default.json"),
}));

const fs = await import("fs");

describe("printConfig", () => {
    const logSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    const dirSpy = vi.spyOn(console, "dir").mockImplementation(() => {});
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    const exitSpy = vi.spyOn(process, "exit").mockImplementation(() => {
        throw new Error("EXIT");
    });

    beforeEach(() => {
        vi.resetAllMocks();
    });

    it("should print merged config and masked env", async () => {
        (fs.existsSync as any).mockReturnValue(true);
        (fs.readFileSync as any).mockReturnValue(
            `FIREBASE_API_KEY="MySuperSecret"\nPASSWORD=abcdef123456\nHUB=berlin`
        );

        await printConfig();

        expect(logSpy).toHaveBeenCalledWith("Current configuration:");
        expect(logSpy).toHaveBeenCalledWith("Default config path:", "/config/default.json");
        expect(logSpy).toHaveBeenCalledWith("User config path:", "/fake-home/.flinkord/config.json");

        expect(dirSpy).toHaveBeenCalledWith({
            mergedConfig: expect.objectContaining({
                consumerApiUrl: "https://consumer.fake",
                firebaseUrl: "https://firebase.fake",
                quinyxPassword: "super-secret",
            }),
            env: {
                FIREBASE_API_KEY: "MySu...cret",
                PASSWORD: "abcd...3456",
                HUB: "berlin",
            },
        }, expect.anything());
    });

    it("should handle missing .env gracefully", async () => {
        (fs.existsSync as any).mockReturnValue(false);

        await printConfig();

        expect(dirSpy).toHaveBeenCalledWith({
            mergedConfig: expect.anything(),
            env: {},
        }, expect.anything());
    });

    it("should log error and exit on failure", async () => {
        vi.mocked(utils.getConfigFilePath).mockRejectedValue(new Error("fail"));

        await expect(printConfig()).rejects.toThrow('process.exit unexpectedly called with "1"');
        expect(errorSpy).toHaveBeenCalledWith("Failed to load configuration:", "fail");
    });
});