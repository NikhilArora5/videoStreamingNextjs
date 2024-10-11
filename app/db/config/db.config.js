const { Model, DataTypes } = require('sequelize')
const sequelize = require('./sequelize')

const connect = () => {
  const db = {}
  db.sequelize = sequelize

  const models = {
    user: require("../models/user")(sequelize, DataTypes, Model),
    book: require("../models/book")(sequelize, DataTypes, Model)
  }

  // adding Models to db
  db.user = models.user
  db.book = models.book



  // Associations
  db.book.belongsTo(db.user, {
    foreignKey: "author_id"
  })

  db.user.hasMany(db.book, {
    foreignKey: 'author_id',
    as: 'books',
    sourceKey: "id",
    onDelete: 'CASCADE'
  })

  db.user.belongsTo(db.user, {
    foreignKey: 'creater_id',
    as: "creater"
  })
  // db.user.hasOne(db.user, {
  //   foreignKey: 'creater_id',
  //   as: "creater"
  // })
  db.user.hasMany(db.user, { foreignKey: 'creater_id', as: 'childUsers' })

  return db
}

module.exports = {
  connect
}
