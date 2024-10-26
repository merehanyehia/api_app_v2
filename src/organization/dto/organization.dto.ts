import { IsNotEmpty, IsEmail, IsString } from 'class-validator';

export class OrganizationDto {
  @IsNotEmpty({ message: 'name is required' })
  @IsString()
  name: string;
  @IsNotEmpty({ message: 'description is required' })
  @IsString()
  description: string;
}
