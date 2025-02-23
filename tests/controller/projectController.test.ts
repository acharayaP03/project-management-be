import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { PrismaClient } from '@prisma/client';
// import { APIError } from '../../src/utils/errorHandlers';
import { createProject } from '../../src/controllers/projectController';
import { jest } from '@jest/globals';

jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn().mockReturnValue({
    project: {
      create: jest.fn(),
    },
  }),
}));

describe('Controller: createProject', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let prisma: jest.Mocked<PrismaClient>;

  beforeEach(() => {
    mockRequest = {
      body: {
        name: 'Test Project',
        description: 'Test Description',
        startDate: '2022-01-01',
        endDate: '2022-02-01',
      },
    };

    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    prisma = new PrismaClient() as jest.Mocked<PrismaClient>;
  });

  it('should create a project successfully', async () => {
    const expectedProject = {
      id: 1,
      ...mockRequest.body,
    };

    (prisma.project.create as jest.Mock).mockResolvedValueOnce(expectedProject);
    await createProject(mockRequest as Request, mockResponse as Response);

    expect(prisma.project.create).toHaveBeenCalledWith({
      data: {
        name: mockRequest.body.name,
        description: mockRequest.body.description,
        startDate: mockRequest.body.startDate,
        endDate: mockRequest.body.endDate,
      },
    });

    expect(mockResponse.status).toHaveBeenCalledWith(StatusCodes.CREATED);
    expect(mockResponse.json).toHaveBeenCalledWith(expectedProject);
  });
});
