import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { User } from '../user/user.model';
import { TLoginUser } from './auth.interface';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import config from '../../config';

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
  const accessToken = jwt.sign(jwtPayload, config.jwt_access_secret as string, {
    expiresIn: '10d',
  });
  return {
    accessToken,
    needsPasswordChange: isUserExists?.needsPasswordChange,
  };
};

const changePassword = (user: { userId: string; role: string }, payload) => {
  const result = await User.findOneAndUpdate({
    id: user.userId,
    role: user.role,
  });
};

export const AuthServices = {
  loginUser,
  changePassword,
};
