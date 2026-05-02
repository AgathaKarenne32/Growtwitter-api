import request from 'supertest';
import { app } from '../../src/app';
import { describe, it, expect } from '@jest/globals'; 

describe('User Integration Tests', () => {
  it('should create a new user via HTTP POST', async () => {
    const uniqueUsername = `testuser_${Date.now()}`;
    
    const response = await request(app)
      .post('/users')
      .send({
        name: "Test User",
        username: uniqueUsername,
        imageUrl: "http://example.com/image.png",
        password: "password123"
      });

    if (response.status !== 201) {
      console.log("Erro capturado no teste:", response.body);
    }

    expect(response.status).toBe(201);

    expect(response.body.data).toHaveProperty('id');
    expect(response.body.data.name).toBe("Test User");
    expect(response.body.data.username).toBe(uniqueUsername);
    
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe("User created successfully.");
  });
});