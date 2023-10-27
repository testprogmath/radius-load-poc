import {describe, test} from "@jest/globals";
import {addShift} from "../src";
import {QuinyxShiftType} from "../src/shared/enums";

describe('Test addShift command', () => {
    jest.retryTimes(3, {logErrorsBeforeRetry: true});

    test('AddShift command', async () => {

        let shiftDetails = await addShift( "de_ham_wint",
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