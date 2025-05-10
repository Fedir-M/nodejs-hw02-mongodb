import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import handlebars from 'handlebars';
import path from 'node:path';
import fs from 'node:fs/promises';

import { randomBytes } from 'node:crypto';
import createHttpError from 'http-errors';
import UserCollection from '../db/UserModel.js';
import SessionCollection from '../db/SessionModel.js';
import {
  accessTokenLifeTime,
  refreshTokenLifeTime,
} from '../constants/authConst.js';
import { getEnvVar } from '../utils/getEnvVar.js';
import { sendEmail } from '../utils/sendMail.js';
import { SMTP, TEMPLATES_DIR } from '../constants/index.js';

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

//* ============================= logoutUser =========================
export const logoutUser = (sessionId) =>
  SessionCollection.deleteOne({ _id: sessionId });

//* =========================== requestResetToken =========================
export const requestResetToken = async (email) => {
  const user = await UserCollection.findOne({ email });
  if (!user) {
    throw createHttpError(404, 'User not found!');
  }

  // jwt.sign(payload, secretOrPrivateKey, [options, callback])
  const resetToken = jwt.sign(
    {
      subject: user._id,
      email,
    },
    getEnvVar('JWT_SECRET'),
    {
      expiresIn: '5m',
    },
  );

  // await sendEmail({
  //   from: getEnvVar(SMTP.SMTP_FROM),
  //   to: email,
  //   subject: 'Reset your password',
  //   html: `<p>Click <a href="${resetToken}">here</a> to reset your password!</p>`,
  // });
  try {
    const resetPasswordTemplatePath = path.join(
      TEMPLATES_DIR,
      'reset-password-email.html',
    );

    const templateSource = (
      await fs.readFile(resetPasswordTemplatePath)
    ).toString();

    const template = handlebars.compile(templateSource);
    const html = template({
      name: user.name,
      resetLink: `${getEnvVar(
        'APP_DOMAIN',
      )}/reset-password?token=${resetToken}`,
    });

    await sendEmail({
      from: getEnvVar(SMTP.SMTP_FROM),
      to: email,
      subject: 'Reset your password',
      html,
    });
  } catch (err) {
    console.error('Email sending in requestResetToken - failed:', err);
    throw createHttpError(
      500,
      'Failed to send the email, please try again later.',
    );
  }

  //? should I use this line in my code?
  // return { message: 'Reset password email has been successfully sent.' };
};
//* ======================= resetPassword =========================
export const resetPassword = async (payload) => {
  let entries;

  try {
    entries = jwt.verify(payload.token, getEnvVar('JWT_SECRET'));
  } catch (err) {
    if (err instanceof Error)
      throw createHttpError(401, 'Token is expired or invalid.');
  }

  const user = await UserCollection.findOne({
    email: entries.email,
    _id: entries.subject,
  });

  if (!user) {
    throw createHttpError(404, 'User not found!');
  }

  const encryptedPassword = await bcrypt.hash(payload.password, 10);

  await UserCollection.updateOne(
    { _id: user._id },
    { password: encryptedPassword },
  );

  await SessionCollection.deleteMany({ userId: user._id }); // deleting all docs connecting to current _id in the base.
};
