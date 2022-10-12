import { Response, Request } from 'express';
import { User } from '../../models/user.model';

export interface IExpressResponse extends Response {
    error(error: any, message?: string): IExpressResponse;
    data<T>(data: T): IExpressResponse;
    errorMessage(message: string): IExpressResponse;
}

export interface IExpressRequest extends Request {
    bodyOld?: Record<string, unknown>;
    id?: string;
    user?: User
}