/**
 * @description Error response
 * @param {Error} error
 * @returns {Object} { status, message }
 */
export const response = (error) => {
  console.log(error);
  if (error.status === 500) {
    return {
      status: 500,
      message: 'Internal Server Error',
    };
  }
  return {
    status: error.status,
    message: error.message,
  };
};
