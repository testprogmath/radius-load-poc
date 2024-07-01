import type {Config} from "jest";

const config: Config = {
    clearMocks: true,
    moduleFileExtensions: ["js", "ts", "tsx"],
    verbose: true,
    transform: {
        "^.+\\.tsx?$": "ts-jest",
    },
    transformIgnorePatterns: [
        "/node_modules/",
    ],
    globals: {
        'ts-jest': {
            tsconfig: 'tsconfig.json',
        },
    },
};

export default config;