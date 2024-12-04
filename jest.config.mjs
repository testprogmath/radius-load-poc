export default {
    preset: 'ts-jest/presets/default-esm',
    testTimeout: 10000,
    transform: {
        '^.+\\.tsx?$': [
            'ts-jest',
            { useESM: true }
        ]
    },
    extensionsToTreatAsEsm: ['.ts'],
    moduleNameMapper: {
        '^(\\.{1,2}/.*)\\.js$': '$1',
    },
    testEnvironment: 'node',
    reporters: [
        "default",
        [
            "jest-html-reporter",
            {
                pageTitle: "Test Report",
                outputPath: "./test-report.html",
                includeFailureMsg: true,
                includeConsoleLog: true,
            },
        ],
    ],
};