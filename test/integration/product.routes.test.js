const request = require('supertest');
const app = require('../../backend/app');
const dbHandler = require('./db-handler');

jest.setTimeout(30000);

describe('Product Integration Tests', () => {
    beforeAll(async () => await dbHandler.connect());
    afterEach(async () => await dbHandler.clearDatabase());
    afterAll(async () => await dbHandler.closeDatabase());

    describe('GET /api/products', () => {
        it('should return empty list initially', async () => {
            const res = await request(app).get('/api/products');
            expect(res.statusCode).toEqual(200);
            expect(res.body).toEqual(expect.any(Array));
            expect(res.body.length).toBe(0);
        });
    });

    // Note: Creating products might require Admin auth if middleware is enforced.
    // For this basic test suite, we can mock the middleware or test the public read APIs mostly.
    // Or if we can create a product directly via model in beforeEach.

    const Product = require('../../backend/src/models/product.model');

    describe('GET /api/products/:id', () => {
        it('should return a product by id', async () => {
            // Seed directly
            const product = await Product.create({
                name: 'Test Product',
                price: 100,
                description: 'Test Desc',
                stock: 10,
                category: '65e9b7f5c35b8e9d4d8b4567', // Fake ID or need real category? Mongoose might validate ObjectId
                images: ['image.jpg']
            });

            const res = await request(app).get(`/api/products/${product._id}`);
            expect(res.statusCode).toEqual(200);
            expect(res.body.name).toBe('Test Product');
        });

        it('should return 404 for invalid id', async () => {
            const res = await request(app).get('/api/products/65e9b7f5c35b8e9d4d8b9999');
            expect(res.statusCode).toEqual(404);
        });
    });
});
