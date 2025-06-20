import { config } from "dotenv";
config();

export default {
    PORT: Number(process.env.PORT),
    PG_HOST: String(process.env.PG_HOST),
    PG_PORT: Number(process.env.PG_PORT),
    PG_USER: String(process.env.PG_USER),
    PG_PASS: String(process.env.PG_PASS),
    PG_DB: String(process.env.PG_DB),
    // SUPERADMIN_USERNAME: String(process.env.SUPERADMIN_USERNAME),
    // SUPERADMIN_EMAIL: String(process.env.SUPERADMIN_EMAIL),
    // SUPERADMIN_PHONE: String(process.env.SUPERADMIN_PHONE),
    // SUPERADMIN_PASSOWORD: String(process.env.SUPERADMIN_PASSWORD),
}