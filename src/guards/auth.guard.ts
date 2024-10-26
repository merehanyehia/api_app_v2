import {
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const key = process.env.ACCESS_TOKEN_SECRET_KEY;

    if (!key) {
      throw new NotFoundException('key not found');
    }
    try {
      let token = request.headers['authorization'];
      if (!token) {
        throw new UnauthorizedException('Please Provide Token');
      }
      token = token.split(' ')[1];

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const decode = jwt.verify(token, key);
      request.decodedToken = decode;

      return true;
    } catch (err) {
      throw new UnauthorizedException(err);
 
    }
  }
}
