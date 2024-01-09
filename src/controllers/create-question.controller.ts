import {Body, Controller, Post, UseGuards} from "@nestjs/common";
import {CurrentUser} from "src/auth/current-user-decorator";
import {JwtAuthGuard} from "src/auth/jwt-auth.guard";
import {UserPayload} from "src/auth/jwt.strategy";
import {ZodValidationPipe} from "src/pipes/zod-validation.pipe";
import {PrismaService} from "src/prisma/prisma.service";
import {z} from "zod";

const createQuestionBodySchema = z.object({
  title: z.string(),
  content: z.string()
})

const bodyValidationPipe = new ZodValidationPipe(createQuestionBodySchema)

type CreateQuestionBodySchema = z.infer<typeof createQuestionBodySchema>

@Controller("/questions")
@UseGuards(JwtAuthGuard)
export class CreateQuestionController {
  constructor(private prisma: PrismaService) {}
  
  @Post()
  async handle(
    @CurrentUser() user:UserPayload,
    @Body(bodyValidationPipe) body: CreateQuestionBodySchema
  ) {

    const {content, title} = body;
    const authorId = user.sub;

    await this.prisma.question.create({
      data: {
        content, 
        title, 
        slug: "asd",
        authorId
      }
    })
  }
};