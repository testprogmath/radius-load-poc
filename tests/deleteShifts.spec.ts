import { describe, test } from 'vitest';
import { deleteShifts } from '../src/index.js';

const TEST_HUB = "de_ham_winw";
const TEST_SHIFT_ID = "10133422";
const TEST_EMAIL = "autotest-hubone@goflink.com";
const TEST_PASSWORD = "password123&";
const IS_CLI = false;

describe('Test deleteShifts command', () => {
    test('DeleteShift command when sessions are scheduled', async () => {
        await deleteShifts(TEST_HUB, TEST_SHIFT_ID, TEST_EMAIL, TEST_PASSWORD, IS_CLI);
    });
});