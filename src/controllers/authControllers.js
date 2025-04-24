import {
  registerUser,
  loginUser,
  refreshUser,
  logoutUser,
} from '../services/authServices.js';

const setupSession = (res, session) => {
  res.cookie('refreshToken', session.refreshToken, {
    httpOnly: true,
    expires: session.refreshTokenValidUntill,
  });

  //
  res.cookie('sessionId', session._id, {
    httpOnly: true,
    expires: session.refreshTokenValidUntill,
  });
};

export const registerController = async (req, res) => {
  const newUser = await registerUser(req.body);
  // eslint-disable-next-line no-unused-vars
  const { password, ...newUserWithoutPassword } = newUser.toObject
    ? newUser.toObject()
    : newUser;

  res.status(201).json({
    status: 201,
    message: 'Successfully registered a user!',
    data: newUserWithoutPassword,
  });
  console.log(newUserWithoutPassword);
};

export const loginController = async (req, res) => {
  const session = await loginUser(req.body);

  setupSession(res, session);

  res.json({
    status: 200,
    message: 'Successfully logged in an user!',
    data: {
      accessToken: session.accessToken,
    },
  });
};

export const refreshController = async (req, res) => {
  const session = await refreshUser(req.cookies); //* req.cookies = { refreshToken, sessionId }
  // const session = await refreshUser({ refreshToken, sessionId }); аналог вверхней строки, просто явно указано и передано

  setupSession(res, session);

  res.json({
    status: 200,
    message: 'Successfully refreshed a session!',
    data: {
      accessToken: session.accessToken,
    },
  });
};

export const logoutController = async (req, res) => {
  if (req.cookies.sessionId) {
    await logoutUser(req.cookies.sessionId);
  }
  res.clearCookie('sessionId');
  res.clearCookie('refreshToken');

  res.status(204).send();
};
