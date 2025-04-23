import { vi } from 'vitest';

export const createConsoleSpy = () => {
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    const debugSpy = vi.spyOn(console, 'debug').mockImplementation(console.log);

    const restoreAll = () => {
        logSpy.mockRestore();
        debugSpy.mockRestore();
    };

    return {
        logSpy,
        debugSpy,
        restoreAll,
    };
};