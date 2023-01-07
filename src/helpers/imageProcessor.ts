import { formatTypes } from '../constants';

export const isValidFormatType = (format: string): Boolean => {
  return formatTypes.includes(format);
};
