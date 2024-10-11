'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Book extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.author_id=this.belongsTo(models.User,{
        foreignKey:"author_id",
      })
    }
  }
  Book.init({
    name: {
      type: DataTypes.STRING,
      allowNull:false
    },
    author_id:{
      type: DataTypes.INTEGER,
      allowNull:false
    }
  }, {
    sequelize,
    modelName: 'Book',
  });
  return Book;
};