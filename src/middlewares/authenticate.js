import createHttpError from 'http-errors';

import { findSession, findUser } from '../services/authServices.js';

export const authenticate = async (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    return next(createHttpError(401, 'Authorization header missing'));
  }

  const [bearer, accessToken] = authorization.split(' ');
  if (bearer !== 'Bearer' || !accessToken) {
    return next(createHttpError(401, 'Header type must be Bearer'));
  }

  const session = await findSession({ accessToken });
  if (!session) {
    return next(createHttpError(401, 'Session has not been found'));
  }

  if (session.accessTokenValidUntil < Date.now()) {
    return next(createHttpError(401, 'Access token expired'));
  }

  const user = await findUser(session.userId);
  if (!user) {
    return next(createHttpError(401, 'User not found'));
  }

  req.user = user;
  next();
};
