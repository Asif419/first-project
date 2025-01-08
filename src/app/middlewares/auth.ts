import { NextFunction, Request, Response } from 'express';
import { AnyZodObject } from 'zod';
import catchAsync from '../utils/catchAsync';
import AppError from '../errors/AppError';
import httpStatus from 'http-status';
import jwt, { JwtPayload } from 'jsonwebtoken';
import config from '../config';
import { TUserRole } from '../modules/user/user.interface';
import { User } from '../modules/user/user.model';

const auth = (...requiredRules: TUserRole[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    // check token has been send or not
    const token = req.headers.authorization;
    if (!token) {
      throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized');
    }

    const decoded = jwt.verify(
      token,
      config.jwt_access_secret as string,
    ) as JwtPayload;

    const { role, userId, iat } = decoded;

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

    if (requiredRules && !requiredRules.includes(role)) {
      throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized');
    }

    // decoded undefined
    req.user = decoded as JwtPayload;
    next();
  });
};

export default auth;
