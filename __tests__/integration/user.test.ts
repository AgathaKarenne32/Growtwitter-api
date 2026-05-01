import request from 'supertest';
import { app } from '../../src/app';
import { describe, it, expect } from '@jest/globals'; 

describe('User Integration Tests', () => {
  it('should create a new user via HTTP POST', async () => {
    // Certifique-se de que o banco de dados (Prisma) esteja acessível para o teste
    const response = await request(app)
      .post('/users') // Verifique se sua rota de criação é esta
      .send({
        name: "Test User",
        username: `testuser_${Date.now()}`, // Username dinâmico para não dar erro de Unique no banco
        imageUrl: "http://example.com/image.png",
        password: "password123"
      });

    // Se o retorno for 201, a integração entre Express -> Service -> Prisma funcionou!
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body.name).toBe("Test User");
  });
});