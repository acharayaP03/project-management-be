import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { PrismaClient } from '@prisma/client';
import { APIError } from '../utils/errorHandlers';

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
  // validating request body
  if (!request.body || Object.keys(request.body).length === 0) {
    throw new APIError('Request body is missing', StatusCodes.BAD_REQUEST);
  }

  const { name, description, startDate, endDate } = request.body;

  //validating required fields
  const requiredFields = {
    name: 'Project name is required',
    description: 'Project description is required',
    startDate: 'Project start date is required',
    endDate: 'Project end date is required',
  };

  for (const [field, message] of Object.entries(requiredFields)) {
    if (!request.body[field]) {
      throw new APIError(message, StatusCodes.BAD_REQUEST);
    }
  }

  // Validate date fields
  const startDateObj = new Date(startDate);
  const endDateObj = new Date(endDate);

  if (isNaN(startDateObj.getTime())) {
    throw new APIError('Invalid start date format', StatusCodes.BAD_REQUEST);
  }

  if (isNaN(endDateObj.getTime())) {
    throw new APIError('Invalid end date format', StatusCodes.BAD_REQUEST);
  }

  if (startDateObj > endDateObj) {
    throw new APIError(
      'End date must be after start date',
      StatusCodes.BAD_REQUEST,
    );
  }

  const newProject = await prisma.project
    .create({
      data: {
        name,
        description,
        startDate,
        endDate,
      },
    })
    .catch((error) => {
      throw new APIError(
        `Error creating project: ${error.message}`,
        StatusCodes.INTERNAL_SERVER_ERROR,
      );
    });

  response.status(StatusCodes.CREATED).json(newProject);
};
