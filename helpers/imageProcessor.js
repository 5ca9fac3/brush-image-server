const { formatTypes } = require("../constants");

/**
 * @description Checks if the format is supported.
 * @param {String} format 
 * @returns {Boolean} true | false
 */
const isValidFormatType = (format) => {
  return formatTypes.includes(format);
}

module.exports = { isValidFormatType };