import {BadRequestException, Body, ConflictException, Controller, HttpCode, Post} from "@nestjs/common";
import {IUser} from "src/interfaces/user.model";
import {PrismaService} from "src/prisma/prisma.service";

@Controller("/accounts")
export class CreateAccountController {
  constructor(private prisma: PrismaService) {}
  
  @Post()
  @HttpCode(201)
  async handle(@Body() body: IUser) {
    const {name, email, password} = body

    if (!name || !email || !password) {
      throw new BadRequestException("All fields are required.")
    }

    const userWithSameEmail = await this.prisma.user.findFirst({
      where: {email}
    })

    if (userWithSameEmail) {
      throw new ConflictException(
        "User with same email address already exists."
      )
    }

    await this.prisma.user.create({
      data: {
        name, 
        email, 
        password
      }
    })
  }
};