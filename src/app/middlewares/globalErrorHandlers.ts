/* eslint-disable @typescript-eslint/no-explicit-any */

import { ErrorRequestHandler, NextFunction, Request, Response } from 'express';
import { ZodError, ZodIssue } from 'zod';
import { TErrorSource } from '../interface/error';
import config from '../config';
import handleZodError from '../errors/handleZodErrors';

const globalErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
  // declare to change next time
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Something went wrong';
  let errorSources: TErrorSource = [
    {
      path: '',
      message: 'Something went wrong',
    },
  ];

  // if zod then change all declared variable
  if (err instanceof ZodError) {
    const simplifiedError = handleZodError(err);
    statusCode = simplifiedError?.statusCode;
    message = simplifiedError?.message;
    errorSources = simplifiedError?.errorSources;
  }

  // return this when globalErrorHandler called from next() or anywhere
  res.status(statusCode).json({
    success: false,
    message,
    errorSources,
  });
};

export default globalErrorHandler;
