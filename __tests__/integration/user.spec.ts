import request from 'supertest';
import { app } from '../../src/app';
import { describe, it, expect } from '@jest/globals';

describe('User Integration Tests', () => {
  it('should create a new user via HTTP POST', async () => {
    const timestamp = Date.now();

    const userPayload = {
      name: "Test User",
      username: `user_${timestamp}`,
      email: `test_${timestamp}@example.com`,
      password: "password123",
      imageUrl: "http://example.com/image.png"
    };

    const response = await request(app)
      .post('/users')
      .send(userPayload);

    expect(response.status).toBe(201);
    expect(response.body.data.username).toBe(userPayload.username);
    expect(response.body.data.email).toBe(userPayload.email);
  });
});