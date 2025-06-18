import { ConfigService } from '@nestjs/config';

const configService = new ConfigService();

export function getEnv(key: string, fallback: string): string {
  const value = configService.get<string>(key);
  return value !== undefined ? value : fallback;
}

export function getEnvNumber(key: string, fallback: number): number {
  const value = configService.get<string>(key);
  return value !== undefined ? parseInt(value, 10) : fallback;
}
