const tokenService = require('../../../../backend/src/services/token.service');
const jwt = require('jsonwebtoken');

describe('Token Service', () => {
    describe('generateAuthToken', () => {
        it('should generate a valid JWT token', () => {
            const user = {
                id: 'user123',
                role: 'user',
                name: 'Test User'
            };
            // Mock process.env.JWT_SECRET
            process.env.JWT_SECRET = 'test_secret';

            const token = tokenService.generateAuthToken(user);
            const decoded = jwt.verify(token, 'test_secret');

            expect(decoded.sub).toBe('user123');
            expect(decoded.role).toBe('user');
            expect(decoded.name).toBe('Test User');
        });
    });
});
