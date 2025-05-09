import { describe, it, expect, vi, beforeEach } from "vitest";
import { writeFproxyConfig } from "../src/commands/setup.js";

// 👇 Мокаем os
vi.mock("os", () => ({
    homedir: () => "/tmp/fake-home"
}));

// 👇 Мокаем fs
let mockExistsSync: (path: string) => boolean;
let mockReadFileSync: (path: string) => string;
let mockWriteFileSync: (path: string, content: string) => void;

vi.mock("fs", () => ({
    existsSync: (...args: [string]) => mockExistsSync(...args),
    readFileSync: (...args: [string]) => mockReadFileSync(...args),
    writeFileSync: (...args: [string, string]) => mockWriteFileSync(...args),
}));

describe("writeFproxyConfig", () => {
    const fakeYaml = "version: '1'\nservices:\n  - fake-service";

    beforeEach(() => {
        mockReadFileSync = () => fakeYaml;
        mockWriteFileSync = vi.fn();
        mockExistsSync = (path: string) => path.includes("templates"); // шаблон есть, файл в home — нет
    });

    it("writes fproxy.yaml to home directory if not exists", () => {
        writeFproxyConfig();
        expect(mockWriteFileSync).toHaveBeenCalledWith(
            "/tmp/fake-home/fproxy.yaml",
            fakeYaml
        );
    });

    it("skips writing if fproxy.yaml already exists", () => {
        mockExistsSync = () => true;
        writeFproxyConfig();
        expect(mockWriteFileSync).not.toHaveBeenCalled();
    });

    it("logs error if template is missing", () => {
        const logSpy = vi.spyOn(console, "error").mockImplementation(() => {});
        mockExistsSync = () => false;

        writeFproxyConfig();

        expect(logSpy).toHaveBeenCalledWith(expect.stringContaining("template not found"));
    });
});