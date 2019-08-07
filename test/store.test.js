jest.mock('fs');
jest.mock('../src/config');

const fs = require('fs');
const path = require('path');
const config = require('../src/config');
const { list } = require('../src/store');
const songsFixture = require('../data/seeds/songs.json');

const mockSongsStoreFilePath = '/somewhere/in/there.json';
const mockPageSize = 3;
const defaultParams = {
  pageNumber: 0,
};

const getReadFileMock = (err = null, data = JSON.stringify(songsFixture)) => (
  path,
  callback
) => {
  callback(err, data);
};

const getConfigMock = () => () => ({
  pagination: {
    pageSize: mockPageSize,
  },
  store: {
    filePath: mockSongsStoreFilePath,
  },
});

describe('store.js', () => {
  beforeAll(() => {
    fs.readFile.mockImplementation(getReadFileMock());
    config.getConfig.mockImplementation(getConfigMock());
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('list', () => {
    describe('data loading', () => {
      it('reads the correct file', async () => {
        await list(defaultParams);
        expect(fs.readFile).toHaveBeenCalledWith(
          mockSongsStoreFilePath,
          expect.any(Function)
        );
      });
    });

    describe('record transformation', () => {
      it('adds the url field', async () => {
        const { songs } = await list({ pageNumber: 0 });
        const expectedSongs = songsFixture.slice(0, mockPageSize).map(song => {
          const { id } = song;
          const url = `/files/${id}.ogg`;
          return {
            ...song,
            url,
          };
        });

        expect(songs).toEqual(expectedSongs);
      });
    });

    describe('pagination', () => {
      it('returns the correct songs for a non-zero page', async () => {
        const { songs: thirdPageSongs } = await list({ pageNumber: 1 });
        const expectedSongs = songsFixture.slice(
          mockPageSize * 1,
          mockPageSize * 2
        );
        expect(thirdPageSongs).toMatchObject(expectedSongs);
      });

      it('includes the page number in the return value', async () => {
        const expectedPageNumber = 1;
        const { pageNumber } = await list({ pageNumber: expectedPageNumber });
        expect(pageNumber).toEqual(expectedPageNumber);
      });

      it('includes the total number of pages in the return value', async () => {
        const expectedNumPages = Math.ceil(songsFixture.length / mockPageSize);
        const { numPages } = await list({ pageNumber: expectedNumPages });
        expect(numPages).toEqual(expectedNumPages);
      });
    });

    describe('error handling', () => {
      it('buddles up any error thrown by fs.readFile', async () => {
        const message = 'Ouch! Something went wrong!';
        const mockError = new Error(message);
        fs.readFile.mockImplementation(getReadFileMock(mockError));
        await expect(list({ pageNumber: 1 })).rejects.toThrow(mockError);
      });

      it('bubbles up any error thrown by JSON.parse', async () => {
        const badJson = 'Nah, this is not JSON';
        const message = 'Unexpected token N in JSON at position 0';
        const mockError = new Error(message);
        fs.readFile.mockImplementation(getReadFileMock(null, badJson));
        await expect(list({ pageNumber: 1 })).rejects.toThrow(mockError);
      });
    });
  });
});
