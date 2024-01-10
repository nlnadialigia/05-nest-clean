import {Controller, Get, Query} from "@nestjs/common";
import {ZodValidationPipe} from "src/pipes/zod-validation.pipe";
import {PrismaService} from "src/prisma/prisma.service";
import {z} from "zod";

const pageQueryParamSchema = z
  .string()
  .optional()
  .default("1")
  .transform(Number)
  .pipe(z.number().min(1))

type PageQueryParamSchema = z.infer<typeof pageQueryParamSchema>
  
const queryValidationPipe = new ZodValidationPipe(pageQueryParamSchema)

@Controller("/questions")
export class FetchRecentQuestionsController {
  constructor(private prisma: PrismaService) {}
  @Get()
  async handle(@Query("page", queryValidationPipe) page: PageQueryParamSchema) { 
    const perPage = 1;
    
    const questions = await this.prisma.question.findMany({
      take: perPage,
      skip: (page - 1) * perPage,
      orderBy: {
        createdAt: "desc"
      }
    })

    const total = await this.prisma.question.count()
    
    const list = {
      total,
      page,
      limit: perPage,
      questions
    }

    return list
  }
};