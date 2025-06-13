import {Colors} from "../shared/enums.js";
import chalk from "chalk";
import {EmployeeDetails} from "../shared/quinyxDetails.js";

export function printEmployeeDetails(employee: EmployeeDetails): void {
    const details = [
        { label: "First Name", value: employee.firstName, color: Colors.MEXICAN_PINK },
        { label: "Last Name", value: employee.lastName, color: Colors.LAVENDER_PINK },
        { label: "Email", value: employee.email, color: Colors.THULIAN_PINK },
        { label: "Badge Number", value: employee.badgeNumber, color: Colors.MEXICAN_PINK_DARK }
    ];

    console.log("-----------------------------------------------------------------------------------------");
    details.forEach(({ label, value, color }) => {
        console.log(chalk.hex(color)(`${label}:`).padEnd(15) + chalk.hex(Colors.WHITE)(value || "N/A"));
    });
}