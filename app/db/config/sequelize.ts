import { Sequelize } from 'sequelize';
import * as pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const hostName = process.env.PGHOST!;
console.log("hostname",hostName)
const userName = process.env.PGUSER!;
const password = process.env.PGPASSWORD!;
const database = process.env.PGDATABASE!;
const dialect = process.env.PGDIALECT as 'postgres'; // Explicitly typed as 'postgres'
const sslRequire = 'true'; // Better to read from env

const sequelize = new Sequelize(database, userName, password, {
  host: hostName,
  dialect: dialect || 'postgres',
  dialectModule: pg,
  dialectOptions: sslRequire
    ? {
        ssl: {
          require: true,
          rejectUnauthorized: false,
        },
      }
    : undefined,
  pool: {
    max: 10,
    min: 0,
    acquire: 20000,
    idle: 5000,
  },
  logging: false,
});

export default sequelize;
