const axios = require('axios');
require('dotenv').config();

const API_URL = process.env.API_URL || 'http://localhost:8000/api';

describe('System Smoke Tests', () => {
    // Basic connectivity check
    it('should be able to reach the backend', async () => {
        try {
            // Trying to fetch products as a health check since there is no explicit /health endpoint
            const res = await axios.get(`${API_URL}/products`);
            expect(res.status).toBe(200);
        } catch (error) {
            // Fail with a clear message
            throw new Error(`Failed to connect to ${API_URL}: ${error.message}`);
        }
    });
});
