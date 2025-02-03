import { app, myDataSource } from "..";
import { describe, test, expect, beforeAll, afterAll } from '@jest/globals';
import request from 'supertest';

describe('User API Endpoints', () => {
    beforeAll(async () => {
        await myDataSource.initialize();
    });

    afterAll(async () => {
        await myDataSource.destroy();
    });

    test('POST /api/auth/register - should register a new user', async () => {
        const res = await request(app)
            .post('/api/auth/register')
            .send({ name: 'Test User', email: 'test1@example.com', password: 'password123' });
        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty('user');
    });

    test('POST /api/auth/login - should login user and return token', async () => {
        const res = await request(app)
            .post('/api/auth/login')
            .send({ email: 'test1@example.com', password: 'password123' });
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('token');
    });

    test('GET /api/users - should return users list', async () => {
        const res = await request(app)
            .get('/api/users')
            .set('Authorization', `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Mywicm9sZSI6InVzZXIiLCJpYXQiOjE3Mzg2MDY1OTMsImV4cCI6MTczODYxMDE5M30.QindrG3glqaJwtkDRf98Vx4q211wSbT64IQJJPuyl5s`);
        expect(res.statusCode).toBe(200);
    });

    test('GET /api/users/:id - should return a user by ID', async () => {
        const res = await request(app)
            .get('/api/users/3')
            .set('Authorization', `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Mywicm9sZSI6InVzZXIiLCJpYXQiOjE3Mzg2MDY1OTMsImV4cCI6MTczODYxMDE5M30.QindrG3glqaJwtkDRf98Vx4q211wSbT64IQJJPuyl5s`);
        expect(res.statusCode).toBe(200);
    });

    test('PATCH /api/users/:id - should update a user', async () => {
        const res = await request(app)
            .put('/api/users/3')
            .set('Authorization', `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Mywicm9sZSI6InVzZXIiLCJpYXQiOjE3Mzg2MDY1OTMsImV4cCI6MTczODYxMDE5M30.QindrG3glqaJwtkDRf98Vx4q211wSbT64IQJJPuyl5s`)
            .send({ name: 'Updated Name' });
        expect(res.statusCode).toBe(200);
    });

    test('DELETE /api/users/:id - should delete a user', async () => {
        const res = await request(app)
            .delete('/api/users/3')
            .set('Authorization', `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Mywicm9sZSI6InVzZXIiLCJpYXQiOjE3Mzg2MDY1OTMsImV4cCI6MTczODYxMDE5M30.QindrG3glqaJwtkDRf98Vx4q211wSbT64IQJJPuyl5s`);
        expect(res.statusCode).toBe(204);
    });
});