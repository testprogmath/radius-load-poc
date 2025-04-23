import type { CreateOptions } from '../../src/commands/create.js';
import { create } from '../../src/index.js';

export const buildCreateOptions = (
    overrides: Partial<CreateOptions> = {},
    base: Partial<CreateOptions> = {}
): CreateOptions => {
    return {
        hubSlug: 'nl_ams_diem',
        locale: 'en-de',
        email: 'flinkord@goflink.com',
        isCLI: false,
        clickAndCollect: false,
        ...base,
        ...overrides,
    };
};

export const createOrder = async (
    overrides: Partial<CreateOptions> = {},
    base?: Partial<CreateOptions>
) => {
    const options = buildCreateOptions(overrides, base);
    return await create(options);
};