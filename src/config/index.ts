import { Logger } from "@nestjs/common";
import  *  as dotenv from "dotenv";

dotenv.config();

export type ConfigType = {
    PORT: number;
    NODE_ENV: string;
    DB_URL: string;
    ACCESS_TOKEN_KEY: string;
    ACCESS_TOKEN_TIME: string;
    REFRESH_TOKEN_KEY: string;
    REFRESH_TOKEN_TIME: string;
    MAIL_HOST: string;
    MAIL_PORT: string;
    MAIL_USER: string;
    MAIL_PASS:string;
    FILE_PATH: string;
    BASE_API: string;
}

const requiredVariables = [
    'PORT',
    'NODE_ENV',
    'DEV_DB_URL',
    'PROD_DB_URL',
    'ACCESS_TOKEN_KEY',
    'ACCESS_TOKEN_TIME',
    'REFRESH_TOKEN_KEY',
    'REFRESH_TOKEN_TIME',
    'MAIL_HOST',
    'MAIL_PORT',
    'MAIL_USER',
    'MAIL_PASS',
    'FILE_PATH',
    'BASE_API',
];

const missingVariables = requiredVariables.filter((variable) => {
    const value = process.env[variable];
    return !value || value.trim() === '';
});

if(missingVariables.length > 0) {
    Logger.error(
        `Missing or empty required evironment variables: ${missingVariables.join(', ')}`
    );
    process.exit(1);
}

export const config: ConfigType = {
    PORT: parseInt(process.env.PORT as string, 10),
    NODE_ENV: process.env.NODE_ENV as string,
    DB_URL:
        process.env.NODE_ENV === 'dev'
        ? (process.env.DEV_DB_URL as string)
        : (process.env.PROD_DB_URL as string),
    ACCESS_TOKEN_KEY: process.env.ACCESS_TOKEN_KEY as string,
    ACCESS_TOKEN_TIME: process.env.ACCESS_TOKEN_TIME as string,
    REFRESH_TOKEN_KEY: process.env.REFRESH_TOKEN_KEY as string,
    REFRESH_TOKEN_TIME: process.env.REFRESH_TOKEN_TIME as string,
    MAIL_HOST: process.env.MAIL_HOST as string,
    MAIL_PORT: process.env.MAIL_PORT as string,
    MAIL_USER: process.env.MAIL_USER as string,
    MAIL_PASS: process.env.MAIL_PASS as string,
    FILE_PATH: process.env.FILE_PATH as string,
    BASE_API: process.env.BASE_API as string,
};
