import path from 'node:path';

// import * as path from "node:path";
export const TEMPLATES_DIR = path.resolve("src", "templates");

// export const TEMPLATES_DIR = path.join(process.cwd(), 'src', 'templates');
export const TEMP_UPLOAD_DIR = path.join(process.cwd(), 'temp');
export const UPLOAD_DIR = path.join(process.cwd(), 'uploads');
// Ці налаштування дозволяють зберігати завантажені файли у визначеній директорії з унікальними іменами, що забезпечить організоване та безпечне управління файлами на сервері.
export const SORT_ORDER = {
    ASC: 'asc',
    DESC: 'desc'
};

export const FIFTEEN_MINUTES = 15 * 60 * 1000;
export const THERTY_DAY = 30 * 24 * 60 * 60 * 1000;

export const SMTP = {
    SMTP_HOST: 'SMTP_HOST',
    SMTP_PORT: 'SMTP_PORT',
    SMTP_USER: 'SMTP_USER',
    SMTP_PASSWORD: 'SMTP_PASSWORD',
    SMTP_FROM: 'SMTP_FROM',
};

export const CLOUDINARY = {
    CLOUD_NAME: 'CLOUD_NAME',
    API_KEY: 'API_KEY',
    API_SECRET: 'API_SECRET',
};

//  значення які вставив в файл оточення (env) для перевірки так як мої були не авторизовані
// SMTP_HOST = smtp - relay.brevo.com
// SMTP_PORT = 587
// SMTP_USER = 765fb3001@smtp-brevo.com
// SMTP_PASSWORD = xsmtpsib-f533f9d1eab7ec239c37eaa378366307ac9ba7c13c08c93f0a608c40d176d64d-sKxkNGfz7BHpvEbA
// SMTP_FROM = vladislavapelhants@gmail.com


// "name": "Vladislav",
//     "email": "vladislavapelhants@gmail.com",
//         "password": "123Vlad"

// SMTP_HOST = smtp - relay.brevo.com
// SMTP_PORT = 587
// SMTP_USER = 801450002@smtp-brevo.com
// SMTP_PASSWORD = xsmtpsib-2b237ed81d4253bd91cf66cb162760c211eefba83bb6f53d253def9a86bd9a28-PTgWr5tHJvAfVRSc
// SMTP_FROM = litvinenko1978aleks@gmail.com
