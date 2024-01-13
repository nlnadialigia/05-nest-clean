import {AppModule} from "@/app.module";
import {PrismaService} from "@/prisma/prisma.service";
import {RandomTextService} from "@/utils/generate.slug";
import {INestApplication} from "@nestjs/common";
import {JwtService} from "@nestjs/jwt";
import {Test} from "@nestjs/testing";
import request from "supertest";

const randomSlug = new RandomTextService()

const question = {
  content: "Conteúdo teste", 
  title: "Título test", 
  slug: randomSlug.generateRandomText(),
};

const user = {
  name: "Joana Dark",
  email: "joanadark@example.com",
  password: "123456"
};

describe('Create question (E2E)', () => {
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

  test("[POST] /questions",async () => {
    const {id} = await prisma.user.create({
      data: user
    });

    const accessToken = jwt.sign({sub: id})

    const response = await request(app.getHttpServer())
        .post("/questions")
        .set("Authorization", `Bearer ${accessToken}`)
        .send(question)

    expect(response.statusCode).toBe(201)

    const questionOnDatabase = await prisma.question.findFirst({
      where: {title: question.title}
    })

    expect(questionOnDatabase).toBeTruthy()
  })
})