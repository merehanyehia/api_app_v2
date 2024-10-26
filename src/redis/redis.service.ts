import {
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
  UnauthorizedException,
  Inject,
  Logger,
} from '@nestjs/common';
import Redis from 'ioredis';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private client: Redis;
  private readonly logger = new Logger(RedisService.name);

  constructor(@Inject(JwtService) private readonly jwtService: JwtService) {}

  onModuleInit() {
    this.client = new Redis({
      host: process.env.REDIS_HOST,
      port: Number(process.env.REDIS_PORT) || 6379,
      tls:
        process.env.REDIS_TLS === 'true'
          ? { rejectUnauthorized: false }
          : undefined,
    });

    this.client.on('connect', () => this.logger.log('Connected to Redis'));
    this.client.on('error', (error) => this.logger.error('Redis Error', error));
    this.logger.log('Redis client initialized');
  }

  onModuleDestroy() {
    this.client.quit();
  }

  getClient() {
    return this.client;
  }

  async setex(key: string, value: string, seconds: number): Promise<string> {
    return this.client.setex(key, seconds, value);
  }

  async get(key: string): Promise<string | null> {
    return this.client.get(key);
  }

  async invalidateToken(refreshToken: string) {
    try {
      const isBlocked = await this.get(`blocklist:${refreshToken}`);
      console.log('Is token blocked:', isBlocked);

      if (isBlocked) {
        throw new UnauthorizedException(
          'Refresh token is blocked; please log in again',
        );
      }

      const decodedToken = this.jwtService.decode(refreshToken) as {
        exp: number;
      };
      if (!decodedToken || !decodedToken.exp) {
        throw new UnauthorizedException('Invalid token');
      }

      const expirationTime = decodedToken.exp;
      const currentTime = Math.floor(Date.now() / 1000);
      const remainingTime = expirationTime - currentTime;
      console.log('Remaining time:', remainingTime);

      if (remainingTime > 0) {
        const setexResult = await this.setex(
          `blocklist:${refreshToken}`,
          'blocked',
          remainingTime,
        );
      } else {
        throw new UnauthorizedException('Token has already expired');
      }

      return { message: 'Refresh token revoked' };
    } catch (err) {
      console.error('Error revoking token:', err.message);
      throw new UnauthorizedException(err.message);
    }
  }
}
