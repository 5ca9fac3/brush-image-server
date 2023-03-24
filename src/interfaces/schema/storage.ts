import { Image } from './image';

export interface Storage {
  _id: string; // uuid
  sessionToken?: string;
  effects: string[]; // [original, resize_params]
  effectsIdx: number; // index
  effectsApplied: Object;
  currentState: Image; // original | resize_params
}
