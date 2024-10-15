import { Model, Optional } from 'sequelize';

// User Model
export interface UserAttributes {
  id?: number; // Optional for auto-generated IDs
  name: string;
  email: string;
  password: string;
}

export interface UserInstance extends Model<UserAttributes>, UserAttributes {}

// Book Model
export interface BookAttributes {
  id?: number; // Optional for auto-generated IDs
  name: string;
  author_id: number; // Foreign key reference
}

export interface BookInstance extends Model<BookAttributes>, BookAttributes {}

// Video Model (add similar interfaces as needed)
export interface VideoAttributes {
  id?: number;
  title: string;
  description: string;
  image: string;
  video: string;
}

export interface VideoInstance extends Model<VideoAttributes>, VideoAttributes {}
