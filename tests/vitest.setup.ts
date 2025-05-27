import { loadEnvFromJson } from "./scripts/load-test-env.js";
import {beforeEach } from 'vitest';
beforeEach(async () => {
    await loadEnvFromJson();
});