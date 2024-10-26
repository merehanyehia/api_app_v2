import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Length,
  Matches,
} from 'class-validator';

export class SignUpDto {
  @IsNotEmpty({ message: 'Name is required' })
  @Length(3, 10, {
    message: 'Name must be between 8 and 20 characters',
  })
  @IsString()
  name: string;
  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail({}, { message: 'Invalid Email' })
  @IsString()
  email: string;
  @IsNotEmpty({ message: 'Password is required' })
  @IsString()
  @Length(8, 20, {
    message: 'Password must be between 8 and 20 characters',
  })
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    {
      message:
        'Password too weak. It must contain at least 8 characters, including an uppercase letter, a lowercase letter, a number, and a special character.',
    },
  )
  password: string;
}

export class SignInDto {
  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail({}, { message: 'Invalid Email' })
  @IsString()
  email: string;
  @IsNotEmpty({ message: 'Password is required' })
  @IsString()
  password: string;
}

export class RefreshTokenDto {
  @IsNotEmpty({ message: 'refresh_token is required' })
  @IsString()
  refresh_token: string;
}
