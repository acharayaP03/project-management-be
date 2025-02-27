import { Request, Response, NextFunction } from 'express';

export class APIError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(
    message: string,
    statusCode: number = 500,
    isOperational: boolean = true,
  ) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    Error.captureStackTrace(this, this.constructor);
  }
}

export const errorHandler = (
  error: Error,
  request: Request,
  response: Response,
  next: NextFunction,
): void => {
  if (error instanceof APIError) {
    response.status(error.statusCode).json({
      status: 'error',
      statusCode: error.statusCode,
      message: error.message,
      ...(process.env.NODE_ENV === 'development' && { stack: error.stack }),
    });

    return;
  }

  response.status(500).json({
    status: 'error',
    message: error.message,
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack }),
  });
};

export const asyncHandler = (
  fn: (
    request: Request,
    response: Response,
    next: NextFunction,
  ) => Promise<any>,
) => {
  return (
    request: Request,
    response: Response,
    next: NextFunction,
  ): Promise<any> => {
    return Promise.resolve(fn(request, response, next)).catch(next);
  };
};
