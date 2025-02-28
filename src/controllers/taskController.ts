import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { PrismaClient } from '@prisma/client';
import { APIError } from '../utils/errorHandlers.js';

const prisma = new PrismaClient();

export const getTasks = async (
  request: Request,
  response: Response,
): Promise<void> => {
  const { projectId } = request.query;

  try {
    const tasks = await prisma.task.findMany({
      where: {
        projectId: Number(projectId),
      },
      include: {
        author: true,
        assignee: true,
        comments: true,
        attachments: true,
      },
    });

    response.json(tasks);
  } catch (error) {
    if (error instanceof Error) {
      throw new APIError(
        `Error retrieving tasks: ${error.message}`,
        StatusCodes.INTERNAL_SERVER_ERROR,
      );
    }
  }
};

export const createTask = async (
  request: Request,
  response: Response,
): Promise<void> => {
  const {
    title,
    description,
    status,
    priority,
    tags,
    startDate,
    dueDate,
    points,
    projectId,
    authorUserId,
    assignedUserId,
  } = request.body;

  try {
    const newTask = await prisma.task.create({
      data: {
        title,
        description,
        status,
        priority,
        tags,
        startDate,
        dueDate,
        points,
        projectId: Number(projectId),
        authorUserId: Number(authorUserId),
        assignedUserId: Number(assignedUserId),
      },
    });

    response.json(newTask);
  } catch (error) {
    if (error instanceof Error) {
      throw new APIError(
        `Error creating task: ${error.message}`,
        StatusCodes.INTERNAL_SERVER_ERROR,
      );
    }
  }
};

/**
 * @description: patcch request to update status of a task
 * @param {Status} status "todo" | "in-progress" | "done"
 */

export const updateTaskStatus = async (
  request: Request,
  response: Response,
): Promise<void> => {
  const { taskId } = request.params;
  const { status } = request.body;
  try {
    const updateTask = await prisma.task.update({
      where: {
        id: Number(taskId),
      },
      data: {
        status,
      },
    });

    response.json(updateTask);
  } catch (error) {
    if (error instanceof Error) {
      throw new APIError(
        `Error updating task status: ${error.message}`,
        StatusCodes.INTERNAL_SERVER_ERROR,
      );
    }
  }
};
