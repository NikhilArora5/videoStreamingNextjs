import { Model, DataTypes, Sequelize } from 'sequelize';

// Define the attributes for the Video model
export interface VideoAttributes {
  id?: number; // Optional for auto-generated IDs
  title: string;
  temp_bucket_url?: string; // Optional if you want to allow null values
  play_back_url?: string; // Optional if you want to allow null values
  description?: string; // Optional if you want to allow null values
  image?: string; // Optional if you want to allow null values,
  uuid?: string,
  isEncoded?: boolean; // Optional if you want to allow null values
  is_uploaded?: boolean; // Optional if you want to allow null values
  job_id?: string; // Optional if you want to allow null values
  encoding_status?: string; // Optional if you want to allow null values
}

// Define the instance type that includes all attributes and methods
export interface VideoInstance extends Model<VideoAttributes>, VideoAttributes { }

export class Video extends Model<VideoAttributes> implements VideoAttributes {
  public id!: number;
  public title!: string;
  public temp_bucket_url!: string;
  public play_back_url!: string;
  public description!: string; // Optional if you want to allow null values
  public image!: string; // Optional if you want to allow null values
  public uuid!: string

  // Timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

}
// Initialize the Video model
export const initVideoModel = (sequelize: Sequelize) => {
  Video.init(
    {
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      temp_bucket_url: {
        type: DataTypes.STRING,
        allowNull: true, // Allow null if desired
      },
      play_back_url: {
        type: DataTypes.STRING,
        allowNull: true, // Allow null if desired
      },
      description: {
        type: DataTypes.STRING,
        allowNull: true, // Allow null if desired
      },
      image: {
        type: DataTypes.STRING,
        allowNull: true, // Allow null if desired
      },

      uuid: {
        allowNull: false,
        primaryKey: false,
        type: DataTypes.UUID,
        defaultValue: Sequelize.literal('uuid_generate_v4()'),
      },
      isEncoded: {
        allowNull: false,
        primaryKey: false,
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      }
      ,
      is_uploaded: {
        allowNull: false,
        primaryKey: false,
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      job_id: {
        allowNull: true,
        primaryKey: false,
        type: DataTypes.STRING,
      },
      encoding_status: {
        allowNull: true,
        primaryKey: false,
        type: DataTypes.STRING,
      }
    },
    {
      sequelize,
      modelName: 'Video',
    }
  );

  return Video;
};
