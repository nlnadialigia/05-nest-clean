import {CurrentUser} from "@/auth/current-user-decorator";
import {JwtAuthGuard} from "@/auth/jwt-auth.guard";
import {UserPayload} from "@/auth/jwt.strategy";
import {ZodValidationPipe} from "@/pipes/zod-validation.pipe";
import {PrismaService} from "@/prisma/prisma.service";
import {RandomTextService} from "@/utils/generate.slug";
import {Body, Controller, Post, UseGuards} from "@nestjs/common";
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
  constructor(
    private prisma: PrismaService,
    private randomSlug: RandomTextService
  ) {}
  
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
        slug: this.randomSlug.generateRandomText(),
        authorId
      }
    })
  }
};