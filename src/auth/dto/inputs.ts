import { PickType } from '@nestjs/mapped-types';
import { Employee, Prisma } from '@prisma/client';
import { IsNotEmpty, IsString, MinLength, IsEmail } from 'class-validator';
import { IRegisterInput } from '@/auth/interfaces';

export class RegisterInput implements IRegisterInput {
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

export class LoginInput extends PickType(RegisterInput, ['email', 'password']) {}