import inquirer from "inquirer"

export async function promptForHub(defaultHub: string): Promise<string> {
    const response = await inquirer.prompt([
        {type: 'input', name: 'hub', message: 'Enter the desired hub', default: defaultHub}
    ]);
    return response.hub;
}