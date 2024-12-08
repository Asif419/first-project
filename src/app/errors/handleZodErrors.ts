import { ZodError, ZodIssue } from 'zod';
import { TErrorSource } from '../interface/error';
import config from '../config';

// if error from zod then change error to my format
const handleZodError = (err: ZodError) => {
  const errorSources: TErrorSource = err.issues.map((issue: ZodIssue) => {
    return {
      path: issue?.path[issue.path.length - 1],
      message: issue.message,
    };
  });

  const statusCode = 400;

  return {
    statusCode,
    message: 'Zod validation error',
    errorSources,
    stack: config.NODE_ENV === 'development' ? err?.stack : null,
  };
};

export default handleZodError;
