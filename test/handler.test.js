// jest.mock('../src/config');

const { methodNotAllowed, list } = require('../src/handler');

const getMockRes = () => {
  const json = jest.fn();
  return {
    status: jest.fn(() => ({
      json,
    })),
  };
};

describe('handler', () => {
  describe('methodNotAllowed', () => {
    it('calls the correct methods with the correct arguments on req', () => {
      const mockRes = getMockRes();

      const expectedResponseBody = {
        message: 'Method Not Allowed',
      };
      methodNotAllowed(null, mockRes);
      expect(mockRes.status).toHaveBeenCalledWith(405);
      expect(mockRes.status().json).toHaveBeenCalledWith(expectedResponseBody);
    });
  });
});
