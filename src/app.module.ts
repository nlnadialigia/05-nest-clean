import {Module} from '@nestjs/common';
import {ConfigModule} from "@nestjs/config";
import {envSchema} from 'env';
import {PrismaService} from 'src/prisma/prisma.service';
import {AuthModule} from './auth/auth.module';
import {AuthenticateController} from './controllers/authenticate.controller';
import {CreateAccountController} from './controllers/create-account.controller';
 
@Module({
  controllers: [CreateAccountController, AuthenticateController],
  providers: [PrismaService],
  imports: [
    ConfigModule.forRoot({
      validate: (env) => envSchema.parse(env),
      isGlobal: true
    }),
    AuthModule
  ],
})

export class AppModule {}
