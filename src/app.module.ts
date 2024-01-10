import {Module} from '@nestjs/common';
import {ConfigModule} from "@nestjs/config";
import {envSchema} from 'env';
import {PrismaService} from 'src/prisma/prisma.service';
import {AuthModule} from './auth/auth.module';
import {AuthenticateController} from './controllers/authenticate.controller';
import {CreateAccountController} from './controllers/create-account.controller';
import {CreateQuestionController} from './controllers/create-question.controller';
import {FetchRecentQuestionsController} from './controllers/fetch-recent-questions.controller';
import {RandomTextService} from './utils/generate.slug';
 
@Module({
  controllers: [
    CreateAccountController, 
    AuthenticateController, 
    CreateQuestionController,
    FetchRecentQuestionsController
  ],
  providers: [PrismaService, RandomTextService],
  imports: [
    ConfigModule.forRoot({
      validate: (env) => envSchema.parse(env),
      isGlobal: true
    }),
    AuthModule
  ],
})

export class AppModule {}
