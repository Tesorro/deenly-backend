import type { NextFunction, Request, Response } from "express";
import UserService from "./user.service";

const userService = new UserService();

export default class UserController {
  private readonly userService: UserService;

  constructor() {
    this.userService = userService;
  }

  async findById(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await this.userService.findById(req.params.id as string);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      return res.status(200).json({ user });
    } catch (error) {
      next(error);
    }
  }

  async findByEmail(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await this.userService.findByKey(
        "email",
        req.params.email as string,
      );
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      return res.status(200).json({ user });
    } catch (error) {
      next(error);
    }
  }

  async findAll(req: Request, res: Response, next: NextFunction) {
    try {
      const users = await this.userService.findAll();
      return res.status(200).json({ users });
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await this.userService.create(req.body);
      return res.status(201).json({ user });
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await this.userService.update(
        req.params.id as string,
        req.body,
      );
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      return res.status(200).json({ user });
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const success = await this.userService.delete(req.params.id as string);
      if (!success) {
        return res.status(404).json({ message: "User not found" });
      }
      return res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}
