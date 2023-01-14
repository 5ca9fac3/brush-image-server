import { Request } from 'express';

export interface RequestBody extends Request {
  body: {
    [key: string]: string | undefined;
  };
}
