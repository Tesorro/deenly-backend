import type { Prisma } from "../../generated/prisma/client";
import bcrypt from "bcrypt";
import UserRepository from "./user.repository";

const userRepository = new UserRepository();

export default class UserService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = userRepository;
  }

  async findAll() {
    return await this.userRepository.findAll();
  }

  async findById(id: string) {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new Error("User not found");
    }
    return user;
  }

  async findByKey(
    key: keyof Prisma.UserWhereInput,
    value: Prisma.UserWhereInput[keyof Prisma.UserWhereInput],
  ) {
    const user = await this.userRepository.findByKey(key, value);
    if (!user) {
      throw new Error("User not found");
    }
    return user;
  }

  async create(data: Prisma.UserCreateInput) {
    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(data.password, 10);
    return await this.userRepository.create({
      ...data,
      password: hashedPassword,
    });
  }

  async update(id: string, data: Prisma.UserUpdateInput) {
    await this.findById(id); // Ensure user exists before updating

    // If password is being updated, hash it
    if (data.password) {
      data.password = await bcrypt.hash(data.password as any, 10);
    }

    return await this.userRepository.update(id, data);
  }

  async delete(id: string) {
    await this.findById(id); // Ensure user exists before deleting
    return await this.userRepository.delete(id);
  }
}
