import { Model, DataTypes, Sequelize } from 'sequelize';
import { UserAttributes, UserInstance } from '../../types/models'; // Import the declared types

export class User extends Model<UserAttributes> implements UserAttributes {
  public id!: number;
  public name!: string;
  public email!: string;
  public password!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  static associate(models: any) {
    this.hasMany(models.Book, {
      sourceKey: 'id',
      foreignKey: 'author_id',
      as: 'books',
    });
  }
}

// Initialize the User model
export const initUserModel = (sequelize: Sequelize) => {
  User.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      
    },
    {
      sequelize,
      modelName: 'User',
    }
  );
  return User;
};
