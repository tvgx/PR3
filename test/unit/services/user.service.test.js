const userService = require('../../../../backend/src/services/user.service');
const User = require('../../../../backend/src/models/user.model');
const ApiError = require('../../../../backend/src/utils/ApiError');
const httpStatus = require('http-status-codes');

// Mock Mongoose Model
jest.mock('../../../../backend/src/models/user.model');

describe('User Service', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('getUserById', () => {
        it('should return user if found', async () => {
            const mockUser = { _id: 'user123', name: 'Test User' };
            User.findById.mockResolvedValue(mockUser);

            const result = await userService.getUserById('user123');
            expect(result).toEqual(mockUser);
        });

        it('should throw error if user not found', async () => {
            User.findById.mockResolvedValue(null);

            await expect(userService.getUserById('user123'))
                .rejects
                .toThrow(ApiError);
        });
    });
});
