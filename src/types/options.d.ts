import { AvailableFormatInfo, FormatEnum, RGBA, Region } from 'sharp';

export interface Options {
  width?: number;
  height?: number;
  dimension?: Region;
  tintOptions?: RGBA;
  angle?: number;
  blurPoint?: number;
  sharpenPoint?: number;
  formatType?: keyof FormatEnum | AvailableFormatInfo;
}
