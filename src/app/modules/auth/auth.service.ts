import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { User } from '../user/user.model';
import { TLoginUser } from './auth.interface';
import bcrypt from 'bcrypt';
import jwt, { JwtPayload } from 'jsonwebtoken';
import config from '../../config';
import { createToken } from './auth.utils';

const loginUser = async (payload: TLoginUser) => {
  // check if the user exists
  const isUserExists = await User.isUserExistsByCustomId(payload.id);
  if (!isUserExists) {
    throw new AppError(httpStatus.NOT_FOUND, 'This user is not found');
  }

  // check if the user is already deleted
  const isDeleted = isUserExists.isDeleted;
  if (isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is already deleted');
  }

  // check if the user is blocked
  const userStatus = isUserExists?.status;
  if (userStatus == 'blocked') {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is Blocked');
  }

  // check password is correct or not
  if (
    !(await User.isPasswordMatched(payload.password, isUserExists.password))
  ) {
    throw new AppError(httpStatus.FORBIDDEN, 'Password do not matched');
  }

  // access granted then, create token and send to the client
  const jwtPayload = {
    userId: isUserExists.id,
    role: isUserExists.role,
  };

  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string,
  );
  const refreshToken = createToken(
    jwtPayload,
    config.jwt_refresh_secret as string,
    config.jwt_refresh_expires_in as string,
  );

  return {
    accessToken,
    refreshToken,
    needsPasswordChange: isUserExists?.needsPasswordChange,
  };
};

const changePassword = async (
  user: JwtPayload,
  payload: { oldPassword: string; newPassword: string },
) => {
  // check if the user exists
  const isUserExists = await User.isUserExistsByCustomId(user.userId);
  if (!isUserExists) {
    throw new AppError(httpStatus.NOT_FOUND, 'This user is not found');
  }

  // check if the user is already deleted
  const isDeleted = isUserExists.isDeleted;
  if (isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is already deleted');
  }

  // check if the user is blocked
  const userStatus = isUserExists?.status;
  if (userStatus == 'blocked') {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is Blocked');
  }

  // check password is correct or not
  if (
    !(await User.isPasswordMatched(payload.oldPassword, isUserExists.password))
  ) {
    throw new AppError(httpStatus.FORBIDDEN, 'Password do not matched');
  }

  // hash new password
  const newHashPassword = await bcrypt.hash(
    payload.newPassword,
    Number(config.bcrypt_salt_rounds),
  );

  await User.findOneAndUpdate(
    {
      id: user.userId,
      role: user.role,
    },
    {
      password: newHashPassword,
      needsPasswordChange: false,
      passwordChangedAt: new Date(),
    },
  );

  return null;
};

const refreshToken = async (token: string) => {
  const decoded = jwt.verify(
    token,
    config.jwt_refresh_secret as string,
  ) as JwtPayload;

  const { userId, iat } = decoded;

  const isUserExists = await User.isUserExistsByCustomId(userId);
  if (!isUserExists) {
    throw new AppError(httpStatus.NOT_FOUND, 'This user is not found');
  }

  // check if the user is already deleted
  const isDeleted = isUserExists.isDeleted;
  if (isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is already deleted');
  }

  // check if the user is blocked
  const userStatus = isUserExists?.status;
  if (userStatus === 'blocked') {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is Blocked');
  }

  // checking password changing time and JWT created time
  if (
    isUserExists.passwordChangedAt &&
    User.isJWTIssuedBeforePasswordChanged(
      userId.passwordChangedAt,
      iat as number,
    )
  ) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized');
  }

  const jwtPayload = {
    userId: isUserExists.id,
    role: isUserExists.role,
  };

  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string,
  );

  return { accessToken };
};

export const AuthServices = {
  loginUser,
  changePassword,
  refreshToken,
};
