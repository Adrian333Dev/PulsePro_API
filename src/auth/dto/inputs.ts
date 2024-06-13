import { PickType } from '@nestjs/mapped-types';
import { User, Employee, Prisma } from '@prisma/client';
import { IsNotEmpty, IsString, MinLength, IsEmail } from 'class-validator';

export class SignUpInput implements Prisma.UserCreateInput {
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;
}

export class SignInInput extends PickType(SignUpInput, ['email', 'password']) {}
