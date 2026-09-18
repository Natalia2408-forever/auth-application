import bcrypt from 'bcrypt';
import { authController } from '../auth.controller.js';
import { userService } from '../../services/user.service.js';
import { jwtService } from '../../services/jwt.service.js';
import { tokenService } from '../../services/token.service.js';

jest.mock('../../services/user.service.js');
jest.mock('../../services/jwt.service.js');
jest.mock('../../services/token.service.js');
jest.mock('bcrypt');

function mockRequest(body = {}, cookies = {}) {
  return { body, cookies };
}

function mockResponse() {
  return {
    cookie: jest.fn(),
    clearCookie: jest.fn(),
    send: jest.fn(),
    sendStatus: jest.fn(),
  };
}

const FAKE_USER = {
  id: 1,
  name: 'Natalia',
  email: 'natalia@example.com',
  password: 'hashed-pass',
};

describe('authController.register', () => {
  it('throws 400 when name is missing', async () => {
    const req = mockRequest({
      email: 'a@a.com',
      password: 'abc123',
    });

    const res = mockResponse();

    await expect(authController.register(req, res)).rejects.toMatchObject({
      status: 400,
      message: 'Name is required',
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
    });
  });

  it('hashes the password and creates the user when data is valid', async () => {
    const req = mockRequest({
      name: 'Natalia',
      email: 'natalia@example.com',
      password: 'abc123',
    });
    const res = mockResponse();

    bcrypt.hash.mockResolvedValue('hashed-pass');

    await authController.register(req, res);

    expect(bcrypt.hash).toHaveBeenCalledWith('abc123', 10);

    expect(userService.register).toHaveBeenCalledWith(
      'Natalia',
      'natalia@example.com',
      'hashed-pass',
    );

    expect(res.send).toHaveBeenCalled();
  });
});

describe('authController.login', () => {
  it('throws the generic "Invalid email or password" error when the user does not exist', async () => {
    const req = mockRequest({ email: 'ghost@example.com', password: 'x' });
    const res = mockResponse();

    userService.findByEmail.mockResolvedValue(null);

    await expect(authController.login(req, res)).rejects.toMatchObject({
      status: 400,
      message: 'Invalid email or password',
    });
  });

  it('throws the SAME "Invalid email or password" error when the password is wrong', async () => {
    const req = mockRequest({ email: FAKE_USER.email, password: 'wrong' });
    const res = mockResponse();

    userService.findByEmail.mockResolvedValue(FAKE_USER);
    bcrypt.compare.mockResolvedValue(false);

    await expect(authController.login(req, res)).rejects.toMatchObject({
      status: 400,
      message: 'Invalid email or password',
    });
  });

  it('returns tokens and sets an httpOnly refresh cookie on valid credentials', async () => {
    const req = mockRequest({ email: FAKE_USER.email, password: 'correct' });
    const res = mockResponse();

    userService.findByEmail.mockResolvedValue(FAKE_USER);
    bcrypt.compare.mockResolvedValue(true);
    userService.normalize.mockReturnValue(FAKE_USER);
    jwtService.sign.mockReturnValue('access-token');
    jwtService.signRefresh.mockReturnValue('refresh-token');

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

    jwtService.verifyRefresh.mockReturnValue(null);
    tokenService.getByToken.mockResolvedValue(null);

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

    jwtService.verifyRefresh.mockReturnValue({ id: FAKE_USER.id });

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

