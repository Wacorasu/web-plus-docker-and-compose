const {
  JWT_SECRET,
  POSTGRES_DB,
  POSTGRES_USER,
  POSTGRES_PASSWORD,
  POSTGRES_HOST,
  POSTGRES_PORT,
} = process.env;

module.exports = {
  apps: [
    {
      name: 'kpd-backend',
      script: './dist/main.js',
      env_production: {
        NODE_ENV: 'production',
        POSTGRES_DB,
        POSTGRES_USER,
        POSTGRES_PASSWORD,
        POSTGRES_HOST,
        POSTGRES_PORT,
        JWT_SECRET,
      },
    },
  ],
};
