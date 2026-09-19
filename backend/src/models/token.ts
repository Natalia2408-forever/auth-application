import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from 'sequelize';
import { client } from '../utils/db.js';
import { User } from './user.js';

export interface TokenModel extends Model<
  InferAttributes<TokenModel>,
  InferCreationAttributes<TokenModel>
> {
  id: CreationOptional<number>;
  refreshToken: string;
  userId: number;
  createdAt: CreationOptional<Date>;
  updatedAt: CreationOptional<Date>;
}

type TokenColumns = Pick<InferAttributes<TokenModel>, 'refreshToken'>;

export const Token = client.define<TokenModel, TokenColumns>('token', {
  refreshToken: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
});

Token.belongsTo(User);
User.hasOne(Token);
