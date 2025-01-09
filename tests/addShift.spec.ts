import {describe, test} from "@jest/globals";
import {addShift, deleteShifts} from "../src/index.js";
import {QuinyxShiftType} from "../src/shared/enums.js";
import { jest } from '@jest/globals';
describe('Test addShift command', () => {
    jest.retryTimes(3, {logErrorsBeforeRetry: true});
    beforeEach(async () => {
        await deleteShifts("de_ber_mit2",
            "10133422",
            "autotest-hubone@goflink.com",
            "password123&",
            false,);
    })
    test('AddShift command', async () => {

        let shiftDetails = await addShift("de_ber_mit2",
            "10133422",
            QuinyxShiftType.OPS_ASSOCIATE,
            "autotest-hubone@goflink.com",
            "password123&",
            false,);


        console.log(shiftDetails);
        expect(shiftDetails?.begin).toContain(new Date().toISOString().split("T")[0]);
        expect(shiftDetails?.end).toContain(new Date().toISOString().split("T")[0]);
    });
});