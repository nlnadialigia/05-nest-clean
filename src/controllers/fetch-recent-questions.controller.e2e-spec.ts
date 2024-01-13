import {AppModule} from "@/app.module";
import {PrismaService} from "@/prisma/prisma.service";
import {INestApplication} from "@nestjs/common";
import {JwtService} from "@nestjs/jwt";
import {Test} from "@nestjs/testing";
import request from "supertest";

const user = {
  name: "Joana Dark",
  email: "joanadark@example.com",
  password: "123456"
};

const questionsQuery = (qtde: number, userId: string) => {
  const questions = <any>[];

  for (let index = 1; index <= qtde; index++) {
    questions.push({
      content: `content-${index}`, 
      title: `title-${index}`, 
      slug: `slug-${index}`,
      authorId: userId
    });
  }

  return questions;
};


describe('Fetch recent questions (E2E)', () => {
  let app: INestApplication;
  let prisma: PrismaService
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();

    prisma = moduleRef.get(PrismaService);
    jwt = moduleRef.get(JwtService)

    await app.init();
  });

  test("[GET] /questions",async () => {
    const {id} = await prisma.user.create({
      data: user
    });

    const accessToken = jwt.sign({sub: id})

    await prisma.question.createMany({
      data: questionsQuery(2, id)
    })

    const response = await request(app.getHttpServer())
        .get("/questions")
        .set("Authorization", `Bearer ${accessToken}`)
        .send()

    expect(response.statusCode).toBe(200)
  
    expect(response.body.questions).toEqual(
      expect.arrayContaining([
        expect.objectContaining({title: "title-1"}),
        expect.objectContaining({title: "title-2"}),
      ])
    )
  })
})