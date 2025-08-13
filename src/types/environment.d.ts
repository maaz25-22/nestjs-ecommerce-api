declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'development' | 'production' | 'test';
      PORT: string;
      
      // JWT
      JWT_SECRET: string;
      
      // Database
      DB_TYPE: string;
      DB_DATABASE: string;
      
      // Email Configuration
      SMTP_HOST: string;
      SMTP_PORT: string;
      SMTP_USER: string;
      SMTP_PASS: string;
      SMTP_FROM: string;
      FRONTEND_URL: string;
      
      // Kafka (Optional)
      KAFKA_BROKERS?: string;
      KAFKA_CLIENT_ID?: string;
      KAFKA_GROUP_ID?: string;
      KAFKAJS_NO_PARTITIONER_WARNING?: string;
    }
  }
}

export {};
