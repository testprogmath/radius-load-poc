import {describe, test} from "@jest/globals";
import {deleteShifts} from "../src/commands";

describe('Test deleteShifts command', () => {

    test('DeleteShift command when sessions are scheduled', async () => {
        await deleteShifts( "de_ham_wint",
            "10133422",
            "autotest-hubone@goflink.com",
            "password123&",
            false,);
    });

});