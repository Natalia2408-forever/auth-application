import type { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { authController } from '../auth.controller.js';
import { userService } from '../../services/user.service.js';
import { jwtService } from '../../services/jwt.service.js';
import { tokenService } from '../../services/token.service.js';
import type { UserModel } from '../../models/user.js';

jest.mock('../../services/user.service.js');
jest.mock('../../services/jwt.service.js');
jest.mock('../../services/token.service.js');
jest.mock('bcrypt');

const mockedUserService = jest.mocked(userService);
const mockedJwtService = jest.mocked(jwtService);
const mockedTokenService = jest.mocked(tokenService);
const mockedBcryptHash = bcrypt.hash as jest.Mock;
const mockedBcryptCompare = bcrypt.compare as jest.Mock;

function mockRequest(body?: object, cookies: Record<string, string> = {}) {
  return { body, cookies } as Request;
}

function mockResponse() {
  const res = {
    cookie: jest.fn(),
    clearCookie: jest.fn(),
    send: jest.fn(),
    sendStatus: jest.fn(),
  };

  return res as typeof res & Response;
}

const FAKE_USER = {
  id: 1,
  name: 'Natalia',
  email: 'natalia@example.com',
  password: 'hashed-pass',
};

const FAKE_USER_MODEL = FAKE_USER as UserModel;

const FAKE_PAYLOAD = {
  id: FAKE_USER.id,
  name: FAKE_USER.name,
  email: FAKE_USER.email,
};

beforeEach(() => {
  jest.resetAllMocks();
});

describe('authController.register', () => {
  it('throws 400 with a field error when name is missing', async () => {
    const req = mockRequest({
      email: 'a@a.com',
      password: 'abc123',
    });

    const res = mockResponse();

    await expect(authController.register(req, res)).rejects.toMatchObject({
      status: 400,
      message: 'Validation failed',
      errors: { name: 'Name is required' },
    });
  });

  it('throws 400 when name is only spaces', async () => {
    const req = mockRequest({
      name: '   ',
      email: 'a@a.com',
      password: 'abc123',
    });

    await expect(
      authController.register(req, mockResponse()),
    ).rejects.toMatchObject({
      status: 400,
      errors: { name: 'Name is required' },
    });
  });

  it('throws 400 when name is longer than 50 characters', async () => {
    const req = mockRequest({
      name: 'N'.repeat(51),
      email: 'a@a.com',
      password: 'abc123',
    });

    await expect(
      authController.register(req, mockResponse()),
    ).rejects.toMatchObject({
      status: 400,
      errors: { name: 'Name must be at most 50 characters long' },
    });
  });

  it('throws 400 when email or password is invalid', async () => {
    const req = mockRequest({
      name: 'Natalia',
      email: 'not-an-email',
      password: '123',
    });
    const res = mockResponse();

    await expect(authController.register(req, res)).rejects.toMatchObject({
      status: 400,
      message: 'Validation failed',
      errors: {
        email: 'Email is not valid',
        password: 'Password must be at least 6 characters long',
      },
    });
  });

  it('throws 400 (not a TypeError) when there is no body or values are not strings', async () => {
    const res = mockResponse();

    await expect(
      authController.register(mockRequest(undefined), res),
    ).rejects.toMatchObject({ status: 400, message: 'Validation failed' });

    await expect(
      authController.register(
        mockRequest({ name: 1, email: {}, password: [] }),
        res,
      ),
    ).rejects.toMatchObject({ status: 400, message: 'Validation failed' });
  });

  it('hashes the password and creates the user when data is valid', async () => {
    const req = mockRequest({
      name: 'Natalia',
      email: 'natalia@example.com',
      password: 'abc123',
    });
    const res = mockResponse();

    mockedBcryptHash.mockResolvedValue('hashed-pass');

    await authController.register(req, res);

    expect(bcrypt.hash).toHaveBeenCalledWith('abc123', 10);

    expect(userService.register).toHaveBeenCalledWith(
      'Natalia',
      'natalia@example.com',
      'hashed-pass',
    );

    expect(res.send).toHaveBeenCalled();
  });

  it('trims the name and normalizes the email before saving', async () => {
    const req = mockRequest({
      name: '  Natalia  ',
      email: '  Natalia@Example.COM ',
      password: 'abc123',
    });

    mockedBcryptHash.mockResolvedValue('hashed-pass');

    await authController.register(req, mockResponse());

    expect(userService.register).toHaveBeenCalledWith(
      'Natalia',
      'natalia@example.com',
      'hashed-pass',
    );
  });
});

describe('authController.login', () => {
  it('throws the generic "Invalid email or password" error when the user does not exist', async () => {
    const req = mockRequest({ email: 'ghost@example.com', password: 'x' });
    const res = mockResponse();

    mockedUserService.findByEmail.mockResolvedValue(null);

    await expect(authController.login(req, res)).rejects.toMatchObject({
      status: 400,
      message: 'Invalid email or password',
    });
  });

  it('throws the SAME "Invalid email or password" error when the password is wrong', async () => {
    const req = mockRequest({ email: FAKE_USER.email, password: 'wrong' });
    const res = mockResponse();

    mockedUserService.findByEmail.mockResolvedValue(FAKE_USER_MODEL);
    mockedBcryptCompare.mockResolvedValue(false);

    await expect(authController.login(req, res)).rejects.toMatchObject({
      status: 400,
      message: 'Invalid email or password',
    });
  });

  it('returns tokens and sets an httpOnly refresh cookie on valid credentials', async () => {
    const req = mockRequest({ email: FAKE_USER.email, password: 'correct' });
    const res = mockResponse();

    mockedUserService.findByEmail.mockResolvedValue(FAKE_USER_MODEL);
    mockedBcryptCompare.mockResolvedValue(true);
    mockedUserService.normalize.mockReturnValue(FAKE_PAYLOAD);
    mockedJwtService.sign.mockReturnValue('access-token');
    mockedJwtService.signRefresh.mockReturnValue('refresh-token');

    await authController.login(req, res);

    expect(res.cookie).toHaveBeenCalledWith(
      'refreshToken',
      'refresh-token',
      expect.objectContaining({ httpOnly: true }),
    );
    expect(res.send).toHaveBeenCalledWith(
      expect.objectContaining({ accessToken: 'access-token' }),
    );
  });
});

describe('authController.refresh', () => {
  it('throws 401 when there is no refreshToken cookie', async () => {
    const req = mockRequest({}, {});
    const res = mockResponse();

    await expect(authController.refresh(req, res)).rejects.toMatchObject({
      status: 401,
    });
  });

  it('throws 401 when the refresh token is invalid or missing from the database', async () => {
    const req = mockRequest({}, { refreshToken: 'stale-token' });
    const res = mockResponse();

    mockedJwtService.verifyRefresh.mockReturnValue(null);
    mockedTokenService.getByToken.mockResolvedValue(null);

    await expect(authController.refresh(req, res)).rejects.toMatchObject({
      status: 401,
    });
  });
});

describe('authController.logout', () => {
  it('throws 401 when there is no cookie', async () => {
    const req = mockRequest({}, {});
    const res = mockResponse();

    await expect(authController.logout(req, res)).rejects.toMatchObject({
      status: 401,
    });
  });

  it('removes the refresh token and clears the cookie', async () => {
    const req = mockRequest({}, { refreshToken: 'some-token' });
    const res = mockResponse();

    mockedJwtService.verifyRefresh.mockReturnValue(FAKE_PAYLOAD);

    await authController.logout(req, res);

    expect(tokenService.remove).toHaveBeenCalledWith(FAKE_USER.id);
    expect(res.clearCookie).toHaveBeenCalledWith(
      'refreshToken',
      expect.objectContaining({
        httpOnly: true,
        secure: true,
        sameSite: 'none',
      }),
    );
    expect(res.sendStatus).toHaveBeenCalledWith(204);
  });
});
