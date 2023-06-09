export default () => ({
  port: parseInt(process.env.PORT, 10) || 5000,
  jwtAccessSecret: process.env.JWT_ACCESS_TOKEN_SECRET,
  jwtAccessExpiration: parseInt(process.env.JWT_ACCESS_TOKEN_EXPIRATION_TIME),
  jwtRefreshSecret: process.env.JWT_REFRESH_TOKEN_SECRET,
  jwtRefreshExpiration: parseInt(process.env.JWT_REFRESH_TOKEN_EXPIRATION_TIME),
  jwtRefreshExpirationDb: parseInt(process.env.JWT_REFRESH_TOKEN_EXPIRATION_TIME_DB), // seconds
  pswSecret: process.env.PSW_SECRET,
  database: {
    type: 'postgres',
    host: process.env.POSTGRES_HOST,
    port: parseInt(process.env.POSTGRES_PORT, 10) || 5432,
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DATABASE,
  },
});
