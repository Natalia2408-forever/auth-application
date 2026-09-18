import { User, UserModel } from '../models/user.js';
import { ApiError } from '../exeptions/api.error.js';
import { UserPayload } from '../types/user.js';

function normalize({ id, email, name }: UserPayload): UserPayload {
  return { id, email, name };
}

function findByEmail(email: string): Promise<UserModel | null> {
  return User.findOne({ where: { email } });
}

function findById(id: number): Promise<UserModel | null> {
  return User.findByPk(id);
}

async function register(
  name: string,
  email: string,
  hashedPassword: string,
): Promise<UserModel> {
  const existUser = await findByEmail(email);

  if (existUser) {
    throw ApiError.badRequest('User already exists', {
      email: 'User already exists',
    });
  }

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
  });

  return user;
}

export const userService = {
  normalize,
  findByEmail,
  register,
  findById,
};
