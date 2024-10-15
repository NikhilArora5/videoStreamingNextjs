import { Model, DataTypes, Sequelize } from 'sequelize';
import sequelize from './sequelize';
import { User, initUserModel } from '../models/user';
import { Book, initBookModel } from '../models/book'; // Import your Book model
import { Video, initVideoModel } from '../models/video'; // Import your Video model

interface Db {
  sequelize: Sequelize;
  user: typeof User;
  book: typeof Book;
  video: typeof Video;
}

const connect = (): Db => {
  const db: Partial<Db> = {};
  // console.log("sequelize",sequelize)
  db.sequelize = sequelize as Sequelize

  // Initialize models
  db.user = User;
  db.book = Book;
  db.video = Video;

  initUserModel(sequelize);
  initBookModel(sequelize);
  initVideoModel(sequelize);

  // Associations
  if (db.book && db.user) {
    db.book.belongsTo(db.user, {
      foreignKey: 'author_id',
    });

    db.user.hasMany(db.book, {
      foreignKey: 'author_id',
      as: 'books',
      sourceKey: 'id',
      onDelete: 'CASCADE',
    });
  }

  return db as Db;
};

export { connect}
