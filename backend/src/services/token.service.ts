import { Token, TokenModel } from '../models/token.js';

async function save(userId: number, newToken: string): Promise<void> {
  const token = await Token.findOne({ where: { userId } });

  if (!token) {
    await Token.create({ userId, refreshToken: newToken });

    return;
  }

  token.refreshToken = newToken;
  await token.save();
}

function getByToken(refreshToken: string): Promise<TokenModel | null> {
  return Token.findOne({ where: { refreshToken } });
}

function remove(userId: number): Promise<number> {
  return Token.destroy({ where: { userId } });
}

export const tokenService = {
  save,
  getByToken,
  remove,
};
