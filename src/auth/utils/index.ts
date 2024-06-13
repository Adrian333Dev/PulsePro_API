import { UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';

export const throwInvalidCreds = () => {
  throw new UnauthorizedException('Invalid credentials');
};

export const throwInvalidToken = (type: 'Access' | 'Refresh' = 'Access') => {
  throw new UnauthorizedException(`Invalid ${type} token`);
};

export const extractTokenFromHeader = (
  request: Request,
): string | undefined => {
  const [type, token] = request.headers.authorization?.split(' ') ?? [];
  return type === 'Bearer' ? token : undefined;
};
