import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { PrismaClient } from '@prisma/client';
import { createProject } from '../../src/controllers/projectController';
import { jest } from '@jest/globals';

jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn().mockReturnValue({
    project: {
      create: jest.fn(),
    },
  }),
}));

// Create a helper function to properly type the mocks
function createMockResponse() {
  const res: Partial<Response> = {};
  res.status = jest.fn().mockReturnValue(res) as unknown as Response['status'];
  res.json = jest.fn().mockReturnValue(res) as unknown as Response['json'];
  return res as Response;
}

describe('Controller: createProject', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Response;
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

    mockResponse = createMockResponse();
    prisma = new PrismaClient() as jest.Mocked<PrismaClient>;
  });

  it('should create a project successfully', async () => {
    // Define the expected project with explicit typing
    const expectedProject = {
      id: 1,
      name: mockRequest.body.name,
      description: mockRequest.body.description,
      startDate: mockRequest.body.startDate,
      endDate: mockRequest.body.endDate,
      // Add any other fields that your Project type requires
    }; // Cast to your Prisma Project type

    // Mock the create function's return value
    prisma.project.create.mockResolvedValue(expectedProject);

    await createProject(mockRequest as Request, mockResponse);

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
