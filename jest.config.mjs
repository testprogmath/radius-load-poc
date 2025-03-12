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
            "jest-html-reporters",
            {
                publicPath: "./html-report",
                filename: "report.html",
                expand: true,
            },
        ],
    ],
};