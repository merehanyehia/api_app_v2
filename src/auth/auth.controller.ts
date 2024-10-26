import {
  Body,
  Controller,
  Post,
  Req,
  Res,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RefreshTokenDto, SignInDto, SignUpDto } from './dto/auth.dto';

@Controller()
export class AuthController {
  constructor(private authService: AuthService) {}
  @Post('/signup')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async signup(@Req() req, @Res() res, @Body() body: SignUpDto) {
    try {
      const user = await this.authService.signup(body);
      res.status(201).json({ user });
    } catch (err) {
      throw err;
    }
  }

  @Post('/signin')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async login(@Req() req, @Res() res, @Body() body: SignInDto) {
    try {
      const userTokens = await this.authService.login(body);
      const accessToken = userTokens.accessToken;
      const refreshToken = userTokens.refreshToken;

      res
        .status(200)
        .json({ message: 'login successfully', accessToken, refreshToken });
    } catch (err) {
      throw err;
    }
  }

  @Post('/refresh-token')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async exchangeRefreshToken(
    @Req() req,
    @Res() res,
    @Body() body: RefreshTokenDto,
  ) {
    try {
      const userTokens = await this.authService.verifyRefreshToken(
        body.refresh_token,
      );
      const accessToken = userTokens.accessToken;
      const refreshToken = userTokens.refreshToken;

      res.status(200).json({
        message: 'token exchanged successfully',
        accessToken,
        refreshToken,
      });
    } catch (err) {
      throw err;
    }
  }
}
