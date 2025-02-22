import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
export const getProjects = async (
  request: Request,
  response: Response,
): Promise<void> => {
  try {
    const projects = await prisma.project.findMany();
    response.json(projects);
  } catch (error) {
    if (error instanceof Error) {
      response
        .status(500)
        .json({ message: `Error retrieving projects: ${error.message}` });
    }
  }
};
