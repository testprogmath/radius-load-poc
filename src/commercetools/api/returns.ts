import {ClientResponse, Order} from "@commercetools/platform-sdk";
import chalk from "chalk";

export function getReturnsFromTheOrder(orderInfo: ClientResponse<Order>): any[] | null {
    if (orderInfo.body.returnInfo && orderInfo.body.returnInfo.length > 0) {
        orderInfo.body.returnInfo.forEach((returnInfoItem) => {
            if (returnInfoItem.items && returnInfoItem.items.length > 0) {
                returnInfoItem.items.forEach((item, index) => {
                    console.log(chalk.hex("#FF00FF")(`Item ${index + 1}:`));
                    Object.entries(item).forEach(([key, value]) => {
                        console.log(chalk.hex("#FFC0CB")(key.padEnd(15)) + chalk.hex("#FFFFFF")(value ? value : 'N/A'));
                    });
                    console.log('\n');
                });
            }
        });
        return orderInfo.body.returnInfo;
    } else {
        console.log("No return info or items found in the order.");
        return null;
    }
}

export function formatReturnInfo(returnInfo: any[]): void {
    if (!returnInfo || returnInfo.length === 0) {
        console.log("No return info available.");
        return;
    }

    returnInfo.forEach((infoItem, index) => {
        console.log(chalk.hex("#FFA500")(`Return ${index + 1}:`));
        if (infoItem.items && infoItem.items.length > 0) {
            infoItem.items.forEach((item: any, itemIndex: number) => {
                console.log(chalk.hex("#00FFFF")(`  Item ${itemIndex + 1}:`));
                Object.entries(item).forEach(([key, value]) => {
                    console.log(chalk.hex("#7FFF00")(key.padEnd(20)) + chalk.hex("#FFFFFF")(value ?? 'N/A'));
                });
            });
        } else {
            console.log("  No items found for this return.");
        }
        console.log('\n');
    });
}