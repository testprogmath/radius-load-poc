/*
 * For a detailed explanation regarding each configuration property and type check, visit:
 * https://jestjs.io/docs/configuration
 */

import type {Config} from "jest";

const config: Config = {
    // Automatically clear mock calls, instances, contexts and results before every test
    clearMocks: true,
    // An array of file extensions your modules use
    moduleFileExtensions: ["js"],
};

export default config;
