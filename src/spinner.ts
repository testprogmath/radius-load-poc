import ora from 'ora';

const spinner = ora({
    spinner: 'dots3',
});


export const updateSpinnerText = (message: string, isCLI: boolean) => {
    if (isCLI) {
        spinnerText(message);
        spinner.start(message);
    }
}

export const stopSpinner = () => {
    if (spinner.isSpinning) {
        spinner.stop()
    }
}
export const spinnerError = (message?: string) => {
    if (spinner.isSpinning) {
        spinner.fail(message)
    }
}
export const spinnerSuccess = (message?: string) => {
    if (spinner.isSpinning) {
        spinner.succeed(message)
    }
}
export const spinnerText = (message: string) => {
    if (spinner.isSpinning) {
        spinner.text = message
    }
}