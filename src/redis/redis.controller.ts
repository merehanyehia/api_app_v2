import { Body, Controller, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../guards/auth.guard';
import { RedisService } from './redis.service';
import { RefreshTokenDto } from '../auth/dto/auth.dto';

@Controller()
@UseGuards(AuthGuard)
export class RedisController {
  constructor(private readonly redisService: RedisService) {}
  @Post('/revoke-refresh-token')
  async revokeRefreshToken(
    @Req() request: any,
    @Res() response: any,
    @Body() body: RefreshTokenDto,
  ) {
    try {
      const result = await this.redisService.invalidateToken(
        body.refresh_token,
      );
      response.status(200).json(result);
    } catch (err) {
      throw err;
    }
  }
}
