import bcrypt from 'bcrypt';
import { randomBytes } from 'node:crypto';
import createHttpError from 'http-errors';
import UserCollection from '../db/UserModel.js';
import SessionCollection from '../db/SessionModel.js';
import {
  accessTokenLifeTime,
  refreshTokenLifeTime,
} from '../constants/authConst.js';

const createSession = () => {
  const accessToken = randomBytes(30).toString('base64');
  const refreshToken = randomBytes(30).toString('base64');

  const accessTokenValidUntill = Date.now() + accessTokenLifeTime;
  const refreshTokenValidUntill = Date.now() + refreshTokenLifeTime;

  return {
    accessToken,
    refreshToken,
    accessTokenValidUntill,
    refreshTokenValidUntill,
  };
};

export const findSession = (query) => SessionCollection.findOne(query);
export const findUser = (query) => UserCollection.findOne(query);

//* =========== registerUser =========================
export const registerUser = async (payload) => {
  const { email, password } = payload;
  const user = await UserCollection.findOne({ email });
  if (user) {
    throw createHttpError(409, 'Email in use');
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  return await UserCollection.create({ ...payload, password: hashedPassword });
};

//* =========== loginUser =========================
export const loginUser = async (payload) => {
  const { email, password } = payload;
  const user = await UserCollection.findOne({ email });
  if (!user) {
    throw createHttpError(401, `${email} has not been found`);
  }

  const passwordCompare = await bcrypt.compare(password, user.password);
  if (!passwordCompare) {
    throw createHttpError(401, 'Email or password invalid');
  }

  await SessionCollection.findOneAndDelete({ userId: user._id });

  const session = createSession();

  return SessionCollection.create({
    userId: user._id,
    ...session,
  });
};

//* =========== refreshUser =========================
export const refreshUser = async ({ refreshToken, sessionId }) => {
  const session = await findSession({ refreshToken, _id: sessionId });
  if (!session) {
    throw createHttpError(401, 'Session not found');
  }

  if (session.refreshTokenValidUntill < Date.now()) {
    await SessionCollection.findByIdAndDelete(session._id);
    throw createHttpError(401, 'Session token expired');
  }

  await SessionCollection.findOneAndDelete({ userId: session.userId });

  const newSession = createSession();

  return SessionCollection.create({
    userId: session.userId,
    ...newSession,
  });
};

//* =========== logoutUser =========================
export const logoutUser = (sessionId) =>
  SessionCollection.deleteOne({ _id: sessionId });
