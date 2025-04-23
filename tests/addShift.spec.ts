import { describe, test, beforeEach, expect } from 'vitest';
import { addShift, deleteShifts } from '../src/index.js';
import { QuinyxShiftType } from '../src/shared/enums.js';

const TEST_HUB = "de_ber_mit2";
const TEST_SHIFT_ID = "10133422";
const TEST_EMAIL = "autotest-hubone@goflink.com";
const TEST_PASSWORD = "password123&";
const IS_CLI = false;

const today = new Date().toISOString().split("T")[0];

describe('Test addShift command', () => {
    beforeEach(async () => {
        await deleteShifts(TEST_HUB, TEST_SHIFT_ID, TEST_EMAIL, TEST_PASSWORD, IS_CLI);
    });

    test('AddShift command', async () => {
        const shiftDetails = await addShift(
            TEST_HUB,
            TEST_SHIFT_ID,
            QuinyxShiftType.OPS_ASSOCIATE,
            TEST_EMAIL,
            TEST_PASSWORD,
            IS_CLI,
        );

        console.log(shiftDetails);
        expect(shiftDetails?.begin).toContain(today);
        expect(shiftDetails?.end).toContain(today);
    });
});
