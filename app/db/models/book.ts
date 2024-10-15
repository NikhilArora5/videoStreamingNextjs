import { Model, DataTypes, Sequelize } from 'sequelize';
// import { UserModel } from './user'; // Assuming you have a User model

interface BookAttributes {
  id?: number;
  name: string;
  author_id: number;
}

export class Book extends Model<BookAttributes> implements BookAttributes {
  public id!: number;
  public name!: string;
  public author_id!: number;

  // Timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

}

export const initBookModel = (sequelize: Sequelize) => {
  Book.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      author_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'Book',
    }
  );
  return Book;
};
