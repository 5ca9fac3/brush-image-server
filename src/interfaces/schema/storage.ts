import { Image } from './image';

interface AppliedEffect {
  [key: string]: Image
}
export interface Storage {
  _id: string; // uuid
  effects: string[]; // [original, resize_params]
  effectsIdx: number; // index
  effectsApplied: AppliedEffect;
}
