import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * @description Get all projects
 * @param request GET
 * @param response Projects array
 */
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

/**
 * @description Create a new project
 * @param request user input
 * @param response created project
 */
export const createProject = async (
  request: Request,
  response: Response,
): Promise<void> => {
  const { name, description, startDate, endDate } = request.body;
  try {
    const newProject = await prisma.project.create({
      data: {
        name,
        description,
        startDate,
        endDate,
      },
    });

    response.status(201).json(newProject);
  } catch (error) {
    if (error instanceof Error) {
      response
        .status(500)
        .json({ message: `Error creating project: ${error.message}` });
    }
  }
};
