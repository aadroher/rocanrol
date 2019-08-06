jest.mock('fs');
const fs = require('fs');
const path = require('path');
const { list } = require('../store');
const songsFixture = require('./fixtures/songs');

describe('store.js', () => {
  beforeAll(() => {
    fs.readFile.mockImplementation((path, callback) => {
      callback(null, songsFixture);
    });
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('list', () => {
    it('reads the correct file', async () => {
      await list();
      const storeFilePath = `${__dirname}/../../data/songs.json`;
      const expectedFilePath = path.normalize(storeFilePath);
      expect(fs.readFile).toHaveBeenCalledWith(
        expectedFilePath,
        expect.any(Function)
      );
    });
    it('returns all songs', async () => {
      console.log({ songsFixture });
      const songs = await list();
      console.log({ songs });
      expect(songs).toEqual(songsFixture);
    });
  });
});
