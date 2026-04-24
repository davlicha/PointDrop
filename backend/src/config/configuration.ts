export interface AppConfig {
  nodeEnv: string;
  port: number;
  corsOrigin: string;
  swaggerPath: string;
  databaseUrl: string;
}

export default (): AppConfig => ({
  nodeEnv: process.env.NODE_ENV ?? 'development',
  port: parseInt(process.env.PORT ?? '3000', 10),
  corsOrigin: process.env.CORS_ORIGIN ?? 'http://localhost:5173',
  swaggerPath: process.env.SWAGGER_PATH ?? 'api/docs',
  databaseUrl: process.env.DATABASE_URL ?? '',
});
