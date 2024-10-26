import { IsNotEmpty, IsEmail, IsString, IsEmpty } from 'class-validator';

export class Organization_membersDto {
  @IsNotEmpty({ message: 'email is required' })
  @IsString()
  @IsEmail()
  user_email: string;
  @IsEmpty()
  name?: string;
}
