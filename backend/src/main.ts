import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { LoggingInterceptor } from './shared/interceptors/logging.interceptor';
import { AllExceptionsFilter } from './shared/filters/all-exceptions.filter';
import { execSync } from 'child_process';

function killPort(port: number) {
  try {
    execSync(
      `FOR /F "tokens=5" %P IN ('netstat -ano ^| findstr :${port}') DO TaskKill /PID %P /F`,
      { stdio: 'ignore', shell: 'cmd.exe' },
    );
  } catch {
    // Port không bị chiếm → bỏ qua
  }
}

async function bootstrap() {
  const port = Number(process.env.PORT) || 5000;

  killPort(port);

  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');

  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: false,
    }),
  );

  app.useGlobalInterceptors(new LoggingInterceptor());
  app.useGlobalFilters(new AllExceptionsFilter());

  await app.listen(port);
  console.log(`Backend server is running on: http://localhost:${port}/api`);
}

bootstrap();

