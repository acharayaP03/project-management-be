import { describe, it, expect, afterAll } from '@jest/globals';
import request from 'supertest';
import { app } from '../../src/app';

describe('Home Route', () => {
  let server: any;

  beforeAll(async () => {
    server = app.listen(
      8080,
      async () =>
        await new Promise<void>((resolve) => server.close(() => resolve())),
    );
  });

  afterAll(async () => {
    await new Promise<void>((resolve) => server.close(() => resolve()));
  });

  it('should return home route response', async () => {
    const response = await request(app).get('/').expect(200);

    expect(response.text).toBe('Home route response from server');
  });
});
