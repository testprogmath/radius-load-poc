import { defineConfig } from 'vitest/config'

export default defineConfig({
    test: {
        globals: true,
        environment: 'node',
        retry: 3,
        testTimeout: 20000,
        reporters: [
            'default',
            ['html', {
                open: false,
            }],
        ],
    },
})