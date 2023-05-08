const fs = require('fs');
const path = require('path');
const readline = require('readline');

const envFilePath = path.join(process.cwd(), '.env');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

const defaultClientId = 'wxgadKVe9YfVkHWUDhgpIIJ6';
const defaultClientSecret = '0WFvnrfs44KGFKLMwfCB7uXvFyq8Fyoi';

rl.question(`Введите CT_CLIENT_ID (по умолчанию: ${defaultClientId}): `, (inputClientId) => {
    const clientId = inputClientId || defaultClientId;

    rl.question(`Введите CT_CLIENT_SECRET (или используйте значение для клиента по умолчанию): `, (inputClientSecret) => {
        const clientSecret = inputClientSecret || defaultClientSecret;

        const envFileContent = `CT_PROJECT_KEY="flink-staging"
CT_CLIENT_ID="${clientId}"
CT_CLIENT_SECRET="${clientSecret}"
`;

        fs.writeFile(envFilePath, envFileContent, (err) => {
            if (err) {
                console.error('Не удалось создать файл .env:', err);
            } else {
                console.log('Файл .env успешно создан');
            }
            rl.close();
        });
    });
});
