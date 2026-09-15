import { User } from '../models/user.js';
import { ApiError } from '../exeptions/api.error.js';

function normalize({ id, email, name }) {
  return { id, email, name };
}

function findByEmail(email) {
  return User.findOne({ where: { email } });
}

async function register(name, email, hashedPassword) {
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
};
