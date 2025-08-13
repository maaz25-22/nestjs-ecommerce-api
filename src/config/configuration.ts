export default () => ({
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT, 10) || 3000,
  apiPrefix: process.env.API_PREFIX || 'api',
  
  database: {
    type: process.env.DB_TYPE || 'sqlite',
    database: process.env.DB_DATABASE || 'database.sqlite',
    synchronize: process.env.DB_SYNCHRONIZE === 'true',
    logging: process.env.DB_LOGGING === 'true',
  },
  
  graphql: {
    playground: process.env.GRAPHQL_PLAYGROUND === 'true',
    introspection: process.env.GRAPHQL_INTROSPECTION === 'true',
  },
  
  jwt: {
    secret: process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production',
    expiresIn: process.env.JWT_EXPIRES_IN || '24h',
  },
  
  email: {
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.EMAIL_PORT, 10) || 587,
    secure: process.env.EMAIL_SECURE === 'true',
    user: process.env.EMAIL_USER || 'your-email@gmail.com',
    pass: process.env.EMAIL_PASS || 'your-app-password',
  },
  
  kafka: {
    brokers: process.env.KAFKA_BROKERS?.split(',') || ['localhost:9092'],
    clientId: process.env.KAFKA_CLIENT_ID || 'ecommerce-api',
  },
  
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  },
});
