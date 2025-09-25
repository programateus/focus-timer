import { Request } from 'express';
import { TokenPayloadDTO } from '@application/dtos/token-payload-dto';

export type RequestWithUser = Request & { user: TokenPayloadDTO };
