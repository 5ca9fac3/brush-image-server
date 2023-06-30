import { HttpError, ErrorResponse } from '../types';

export const response = (error: HttpError): ErrorResponse => {
  console.log(error);
  if (error.status === 500) {
    return {
      success: false,
      status: 500,
      message: 'Internal Server Error',
    };
  }
  return {
    success: false,
    status: error.status,
    message: error.message,
  };
};
