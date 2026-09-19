import { Sequelize } from 'sequelize';
import 'dotenv/config';

// SSL is on by default (Neon, Render, etc.); set DB_SSL=false for local Postgres without SSL
const useSsl = process.env.DB_SSL !== 'false';

export const client = new Sequelize({
  host: process.env.DB_HOST,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  dialect: 'postgres',
  dialectOptions: useSsl
    ? { ssl: { require: true, rejectUnauthorized: false } }
    : {},
});
