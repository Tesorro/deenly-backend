import { prisma } from "../../lib/prisma";
import type { Prisma } from "../../generated/prisma/client";

export default class UserRepository {
  private readonly db;

  constructor() {
    this.db = prisma;
  }

  async create(data: Prisma.UserCreateInput) {
    return await this.db.user.create({ data });
  }

  async update(id: string, data: Prisma.UserUpdateInput) {
    return await this.db.user.update({ where: { id }, data });
  }

  async delete(id: string) {
    return await this.db.user.delete({ where: { id } });
  }

  async findById(id: string) {
    return await this.db.user.findUnique({ where: { id } });
  }

  async findAll() {
    return await this.db.user.findMany();
  }

  async findByKey(
    key: keyof Prisma.UserWhereInput,
    value: Prisma.UserWhereInput[keyof Prisma.UserWhereInput],
  ) {
    return await this.db.user.findFirst({ where: { [key]: value } });
  }
}
