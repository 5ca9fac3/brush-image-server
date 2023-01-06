import { formatTypes } from '../constants';

/**
 * @description Checks if the format is supported.
 * @param {String} format
 * @returns {Boolean} true | false
 */
export const isValidFormatType = (format) => {
  return formatTypes.includes(format);
};
