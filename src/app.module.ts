import {Module} from '@nestjs/common';
import {PrismaService} from 'src/prisma/prisma.service';
import {CreateAccountController} from './controllers/create-account.controller';
 
@Module({
  controllers: [CreateAccountController],
  providers: [PrismaService],
})

export class AppModule {}
