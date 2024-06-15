import {
  Injectable,
  OnApplicationBootstrap,
  OnApplicationShutdown,
} from '@nestjs/common';
import Redis from 'ioredis';
import { throwInvalidToken } from '../utils';

@Injectable()
export class RefreshTokenIdsStorage
  implements OnApplicationBootstrap, OnApplicationShutdown
{
  private redisClient: Redis;

  onApplicationBootstrap() {
    this.redisClient = new Redis({
      host: 'localhost', // NOTE: According to best practices, we should use the environment variables here instead.
      port: 6379, // 👆
    });
  }

  onApplicationShutdown(signal?: string) {
    return this.redisClient.quit();
  }

  async insert(employeeId: number, tokenId: string): Promise<void> {
    await this.redisClient.set(this.getKey(employeeId), tokenId);
  }

  async validate(employeeId: number, tokenId: string): Promise<boolean> {
    const storedId = await this.redisClient.get(this.getKey(employeeId));
    if (storedId !== tokenId) throwInvalidToken('Refresh');
    return storedId === tokenId;
  }

  async invalidate(employeeId: number): Promise<void> {
    await this.redisClient.del(this.getKey(employeeId));
  }

  private getKey(employeeId: number): string {
    return `employee-${employeeId}`;
  }
}
