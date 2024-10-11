require('dotenv').config()
const { Sequelize } = require('sequelize')
import * as pg from 'pg';
const hostName = process.env.PGHOST
const userName = process.env.PGUSER
const password = process.env.PGPASSWORD
const database = process.env.PGDATABASE
const dialect = process.env.PGDIALECT
const sslRequire = 'true'

const sequelize = new Sequelize(database, userName, password, {
  host: hostName,
  dialect: dialect,
  dialectModule:pg,
  dialectOptions: {
    ssl: sslRequire
      ? {
          require: true,
          rejectUnauthorized: false
        }
      : undefined
  },
  pool: {
    max: 10,
    min: 0,
    acquire: 20000,
    idle: 5000
  },
  logging: false
})

module.exports = sequelize
