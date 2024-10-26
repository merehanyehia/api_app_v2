import {
  BadRequestException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { User } from './model/auth.model';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SignInDto, SignUpDto } from './dto/auth.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UserInerface } from './interface/User.interface';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}
  async signup(signUpData: SignUpDto) {
    const { name, email, password } = signUpData;
    const hashedPassword = await bcrypt.hash(password, 10);

    const findUser = await this.userModel.findOne({
      email: email,
    });

    if (findUser !== null) {
      throw new BadRequestException('User already exists');
    }
    await new this.userModel({
      name,
      email,
      password: hashedPassword,
    }).save();
    return 'user has been signed up successfully';
  }

  async login(signInData: SignInDto) {
    const { email, password } = signInData;

    const user = await this.userModel.findOne({
      email: email,
    });

    if (user == null) {
      throw new UnauthorizedException('User does not exist');
    }
    const matchedPassword = await bcrypt.compare(password, user.password);
    if (!matchedPassword) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return this.generateTokens(user);
  }

  async generateTokens(user: UserInerface) {
    const payload = {
      userId: user._id ? user._id : user.userId,
      username: user.name ? user.name : user.username,
      email: user.email,
    };
    const accessToken = this.jwtService.sign(payload, {
      secret: process.env.ACCESS_TOKEN_SECRET_KEY,
      expiresIn: process.env.ACCESS_TOKEN_EXPIRE_TIME,
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env.REFRESH_TOKEN_SECRET_KEY,
      expiresIn: process.env.REFRESH_TOKEN_EXPIRE_TIME,
    });

    return { accessToken, refreshToken };
  }

  async verifyRefreshToken(refreshToken: string) {
    const validateRefreshToken = this.jwtService.verifyAsync(refreshToken, {
      secret: process.env.REFRESH_TOKEN_SECRET_KEY,
    });
    if (!validateRefreshToken) {
      throw new UnauthorizedException('Invalid refresh token');
    }
    const refreshTokenDecotion = this.jwtService.decode(refreshToken);

    return this.generateTokens(refreshTokenDecotion);
  }
}
