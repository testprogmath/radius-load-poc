import { Spinner } from 'cli-spinner';

const spinner = new Spinner('%s Processing...');
spinner.setSpinnerString('|/-\\');

export const updateSpinnerText = (message: string, isCLI: boolean) => {
    if (isCLI) {
        spinner.setSpinnerTitle(message);
        spinner.start();
    }
};

export const stopSpinner = () => {
    spinner.stop(true);
};

export const spinnerError = (message?: string) => {
    spinner.stop(true);
    console.error(message);
};

export const spinnerSuccess = (message?: string) => {
    spinner.stop(true);
    console.log(message);
};

export const spinnerText = (message: string) => {
    spinner.setSpinnerTitle(message);
};