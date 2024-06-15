import { PickType } from '@nestjs/mapped-types';
import { Employee, Prisma } from '@prisma/client';
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
  @MinLength(6)
  password: string;

  @IsNotEmpty()
  @IsString()
  orgName: string;
}

export class SignInInput extends PickType(SignUpInput, ['email', 'password']) {}
