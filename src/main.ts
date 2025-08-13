import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  
  // Global validation pipe
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  // Cors Configuration
  app.enableCors({
    origin: configService.get('cors.origin'),
    credentials: true,
  });

  const port = configService.get('port');
  await app.listen(port);
  console.log(`🚀 Application is running on: http://localhost:${port}`);

  if (configService.get('nodeEnv') !== 'production') {
  console.log(`📊 GraphQL Playground: http://localhost:${port}/graphql`);
  };

}

bootstrap();
