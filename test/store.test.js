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

const getReplicatedFixture = n =>
  JSON.stringify([...Array(n).keys()].map(i => songsFixture).flat());

const mockReadFile = () => {
  fs.readFile.mockImplementation((path, callback) => {
    callback(null, JSON.stringify(songsFixture));
  });
};

const mockConfig = () => {
  config.getConfig.mockImplementation(() => ({
    pagination: {
      pageSize: mockPageSize,
    },
    store: {
      filePath: mockSongsStoreFilePath,
    },
  }));
};

describe('store.js', () => {
  beforeAll(() => {
    mockReadFile();
    mockConfig();
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
    });
  });
});
