import { ApiError } from '../exeptions/api.error.js';
import { userService } from '../services/user.service.js';
import bcrypt from 'bcrypt';
import { validateEmail, validatePassword } from '../utils/validators.js';

const getAll = async (req, res) => {
  const users = await userService.getAllActivated();

  res.send(users.map(userService.normalize));
};

const updateName = async (req, res) => {
  const { name } = req.body;
  const user = await userService.findById(req.userId);

  if (!name) {
    throw ApiError.badRequest('Name cannot be empty');
  }
  user.name = name;
  await user.save();
  res.send(userService.normalize(user));
};

const updatePassword = async (req, res) => {
  const { oldPassword, newPassword, confirmation } = req.body;

  const user = await userService.findById(req.userId);

  if (!user.password) {
    throw ApiError.badRequest(
      'This account has no password. Sign in with your social provider instead.',
    );
  }

  const passwordError = validatePassword(newPassword);

  if (passwordError) {
    throw ApiError.badRequest(passwordError);
  }

  if (newPassword !== confirmation) {
    throw ApiError.badRequest('New passwords do not match');
  }

  const isOldValid = await bcrypt.compare(oldPassword, user.password);

  if (!isOldValid) {
    throw ApiError.badRequest('Wrong old password');
  }

  user.password = await bcrypt.hash(newPassword, 10);
  await user.save();

  res.send({ message: 'Password changed successfully' });
};

const updateEmail = async (req, res) => {
  const { password, newEmail, newEmailConfirmation } = req.body;
  const user = await userService.findById(req.userId);

  if (!user.password) {
    throw ApiError.badRequest(
      'This account has no password. Sign in with your social provider instead.',
    );
  }

  const emailError = validateEmail(newEmail);

  if (emailError) {
    throw ApiError.badRequest(emailError);
  }

  if (newEmail !== newEmailConfirmation) {
    throw ApiError.badRequest('New emails do not match');
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw ApiError.badRequest('Wrong password');
  }

  const existingUser = await userService.findByEmail(newEmail);

  if (existingUser) {
    throw ApiError.badRequest('Email is already taken');
  }

  user.email = newEmail;
  await user.save();

  res.send(userService.normalize(user));
};

export const userController = {
  getAll,
  updateName,
  updatePassword,
  updateEmail,
};
