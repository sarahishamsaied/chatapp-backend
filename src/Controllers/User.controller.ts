import { Request, Response } from "express";
import UserRepository from "../Repository/User.repository";
import prisma from "../config/prismaClient";

export const index = async (req: Request, res: Response) => {
  const userRepository = new UserRepository(prisma);
  const users = await userRepository.index();
  res.json(users);
};

export const create = async (req: Request, res: Response) => {
  console.log(req.body);
  const { email, password, username, image, emailVerified } = req.body;
  let { dateOfBirth } = req.body;
  if (!dateOfBirth) {
    dateOfBirth = new Date();
  }
  const userRepository = new UserRepository(prisma);
  const user = await userRepository.create({
    email,
    password,
    dateOfBirth,
    username,
    image,
    emailVerified: emailVerified || null,
    coversationIds: [],
  });
  res.json(user);
};

export const login = async (req: Request, res: Response) => {
  console.log("here");
  const { email, password } = req.body;
  const userRepository = new UserRepository(prisma);
  const token = await userRepository.login(email, password);
  res.json(token);
};

export const findById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const userRepository = new UserRepository(prisma);
  const user = await userRepository.findById(id);
  res.json(user);
};

export const findByEmail = async (req: Request, res: Response) => {
  const { email } = req.params;
  const userRepository = new UserRepository(prisma);
  const user = await userRepository.findByEmail(email);
  res.json(user);
};

export const update = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { email, password, dateOfBirth, image } = req.body;
  const userRepository = new UserRepository(prisma);
  const user = await userRepository.update(id, {
    email,
    password,
    dateOfBirth,
    image,
  });
  res.json(user);
};

export const deleteUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  const userRepository = new UserRepository(prisma);
  const user = await userRepository.delete(id);
  res.json(user);
};

export const reactivateUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  const userRepository = new UserRepository(prisma);
  const user = await userRepository.reactivate(id);
  res.json(user);
};
