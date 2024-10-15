import { Dialect, Options } from 'sequelize';

const config: { [key: string]: Options } = {
  development: {
    username: process.env.PGUSER || 'postgres',
    password: process.env.PGPASSWORD || 'password',
    database: process.env.PGDATABASE || 'database_name',
    host: process.env.PGHOST || '127.0.0.1',
    dialect: process.env.PGDIALECT as Dialect || 'postgres',
  },
  test: {
    username: process.env.PGUSER || 'postgres',
    password: process.env.PGPASSWORD || 'password',
    database: process.env.PGDATABASE || 'database_name',
    host: process.env.PGHOST || '127.0.0.1',
    dialect: process.env.PGDIALECT as Dialect || 'postgres',
  },
  production: {
    username: process.env.PGUSER || 'postgres',
    password: process.env.PGPASSWORD || 'password',
    database: process.env.PGDATABASE || 'database_name',
    host: process.env.PGHOST || '127.0.0.1',
    dialect: process.env.PGDIALECT as Dialect || 'postgres',
  },
};

export default config;
