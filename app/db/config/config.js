'use strict'
require('dotenv').config()
module.exports = {
  development: {
    username: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    database: process.env.PGDATABASE,
    host: process.env.PGHOST,
    dialect: process.env.PGDIALECT,
    sslmode: "require",
    ssl:"true",
    dialectOptions: {
      ssl: true
        ? {
          require: true,
          rejectUnauthorized: false
        }
        : undefined,
        dialect: 'postgres'
    }
  },
  test: {
    username: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    database: process.env.PGDATABASE,
    host: process.env.PGHOST,
    dialect: process.env.PGDIALECT,
    sslmode: "require",
    ssl:"true",
    dialectOptions: {
      ssl: true
        ? {
          require: true,
          rejectUnauthorized: false
        }
        : undefined
    }
  },
  production: {
    username: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    database: process.env.PGDATABASE,
    host: process.env.PGHOST,
    dialect: process.env.PGDIALECT,
    sslmode: "require",
    ssl:"true",
    dialectOptions: {
      ssl: true
        ? {
          require: true,
          rejectUnauthorized: false
        }
        : undefined,
        dialect: 'postgres'
    }
  }
}