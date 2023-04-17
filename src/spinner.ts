import ora from 'ora';

const spinner = ora({ // make a singleton so we don't ever have 2 spinners
    spinner: 'dots3',
})

export const updateSpinnerText = (message: string) => {
    spinnerText(message);
    spinner.start(message)
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
        return;
    }
}