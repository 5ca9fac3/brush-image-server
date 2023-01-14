import { RequestMethod } from './requestMethod';

export interface RouteDefinition {
  path: string;
  requestMethod: RequestMethod;
  methodName: string;
}
