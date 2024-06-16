import { PickType } from '@nestjs/mapped-types';
import { Prisma } from '@prisma/client';
import { IsNotEmpty, IsString, MinLength, IsEmail } from 'class-validator';
import { ISignUpInput } from '@/auth/interfaces';

export class SignUpInput implements ISignUpInput {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  name: string;

  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  password: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  orgName: string;
}

export class SignInInput extends PickType(SignUpInput, ['email', 'password']) {}