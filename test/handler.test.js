jest.mock('../src/config');
jest.mock('../src/store');

const { getConfig } = require('../src/config');
const { list: listSongs } = require('../src/store');

const { methodNotAllowed, list } = require('../src/handler');

const mockDefaultPage = 7;

const getMockReq = page => {
  const query = page ? { page } : {};
  return {
    query,
  };
};

const getMockRes = () => {
  const json = jest.fn();
  return {
    status: jest.fn(() => ({
      json,
    })),
  };
};

const getConfigMock = () => () => ({
  pagination: {
    defaultPage: mockDefaultPage,
  },
});

const getListSongsMock = (returnValue = {}, err = null) => () =>
  err ? Promise.reject(err) : Promise.resolve(returnValue);

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

  describe('list', () => {
    beforeAll(() => {
      getConfig.mockImplementation(getConfigMock());
      listSongs.mockImplementation(getListSongsMock());
    });

    beforeEach(() => {
      jest.clearAllMocks();
    });

    describe('parameters', () => {
      it('passes the correct value for the pageNumber', () => {
        const expectedPageNumber = 1984;
        const mockReq = getMockReq(expectedPageNumber);
        const mockRes = getMockRes();
        list(mockReq, mockRes);

        expect(listSongs).toHaveBeenCalledWith({
          pageNumber: expectedPageNumber,
        });
      });

      it('it defaults to the first page when there is no query', () => {
        const mockReq = getMockReq();
        const mockRes = getMockRes();
        list(mockReq, mockRes);

        expect(listSongs).toHaveBeenCalledWith({
          pageNumber: mockDefaultPage,
        });
      });
    });

    describe('response body', () => {
      it('sends the correct value', async () => {
        const expectedPageNumber = 1989;
        const expectedNumPages = 3000;
        const expectedSongs = [{ title: 'Un Rayo de Sol' }];
        const mockListSongsReturnValue = {
          pageNumber: expectedPageNumber,
          numPages: expectedNumPages,
          songs: expectedSongs,
        };
        listSongs.mockImplementation(
          getListSongsMock(mockListSongsReturnValue)
        );
        const mockReq = getMockReq();
        const mockRes = getMockRes();

        await list(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(200);
        expect(mockRes.status().json).toHaveBeenCalledWith({
          page_number: expectedPageNumber,
          num_pages: expectedNumPages,
          songs: expectedSongs,
        });
      });

      it('sends a server error if listSongs throws an error', async () => {
        const expectedErrorMessage = 'All is lost!';
        const mockError = new Error(expectedErrorMessage);

        listSongs.mockImplementation(getListSongsMock(null, mockError));
        const mockReq = getMockReq();
        const mockRes = getMockRes();

        await list(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(500);
        expect(mockRes.status().json).toHaveBeenCalledWith({
          message: expectedErrorMessage,
        });
      });
    });
  });
});
