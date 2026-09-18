import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from 'sequelize';
import { client } from '../utils/db.js';

export interface UserModel extends Model<
  InferAttributes<UserModel>,
  InferCreationAttributes<UserModel>
> {
  id: CreationOptional<number>;
  name: string;
  email: CreationOptional<string | null>;
  password: CreationOptional<string | null>;
  googleId: CreationOptional<string | null>;
  facebookId: CreationOptional<string | null>;
  githubId: CreationOptional<string | null>;
  createdAt: CreationOptional<Date>;
  updatedAt: CreationOptional<Date>;
}

type UserColumns = Omit<
  InferAttributes<UserModel>,
  'id' | 'createdAt' | 'updatedAt'
>;

export const User = client.define<UserModel, UserColumns>('user', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  googleId: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: true,
  },
  facebookId: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: true,
  },
  githubId: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: true,
  },
});
