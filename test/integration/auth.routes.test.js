const request = require('supertest');
const app = require('../../backend/app'); // Import app separately from server.js
const dbHandler = require('./db-handler');

// Configure timeout for slower CI/local envs
jest.setTimeout(30000);

describe('Auth Integration Tests', () => {
    beforeAll(async () => await dbHandler.connect());
    afterEach(async () => await dbHandler.clearDatabase());
    afterAll(async () => await dbHandler.closeDatabase());

    describe('POST /api/auth/register', () => {
        it('should register a new user successfully', async () => {
            const res = await request(app)
                .post('/api/auth/register')
                .send({
                    name: 'Test User',
                    email: 'test@example.com',
                    password: 'password123'
                });

            expect(res.statusCode).toEqual(201);
            expect(res.body.user).toHaveProperty('email', 'test@example.com');
            expect(res.body.user).not.toHaveProperty('password');
        });

        it('should return 400 if email already exists', async () => {
            // First registration
            await request(app)
                .post('/api/auth/register')
                .send({
                    name: 'User 1',
                    email: 'test@example.com',
                    password: 'password123'
                });

            // Duplicate registration
            const res = await request(app)
                .post('/api/auth/register')
                .send({
                    name: 'User 2',
                    email: 'test@example.com',
                    password: 'password456'
                });

            expect(res.statusCode).toEqual(400);
        });
    });

    describe('POST /api/auth/login', () => {
        beforeEach(async () => {
            // Pre-register user
            await request(app)
                .post('/api/auth/register')
                .send({
                    name: 'Login User',
                    email: 'login@example.com',
                    password: 'password123'
                });
        });

        it('should login successfully with correct credentials', async () => {
            const res = await request(app)
                .post('/api/auth/login')
                .send({
                    email: 'login@example.com',
                    password: 'password123'
                });

            expect(res.statusCode).toEqual(200);
            expect(res.body).toHaveProperty('token');
        });

        it('should fail with incorrect password', async () => {
            const res = await request(app)
                .post('/api/auth/login')
                .send({
                    email: 'login@example.com',
                    password: 'wrongpassword'
                });

            // Passport local strategy often returns 401
            expect(res.statusCode).toEqual(401);
        });
    });
});
