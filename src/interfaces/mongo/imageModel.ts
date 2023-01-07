import mongoose from 'mongoose';

import { Image } from '../schema/image';

/* Defining the type for the Image document model. */
export type IImage = Image & mongoose.Document;
