jest.mock('fs');
const fs = require('fs');
const path = require('path');
const { list } = require('../store');
const songsFixture = require('./fixtures/songs.json');

const fixtureReplicationFactor = 20;
const pageSize = 2;

const getReplicatedFixture = n =>
  JSON.stringify([...Array(n).keys()].map(i => songsFixture).flat());

describe('store.js', () => {
  beforeAll(() => {
    fs.readFile.mockImplementation((path, callback) => {
      callback(null, getReplicatedFixture(fixtureReplicationFactor));
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
    it('returns the songs for the first page by default', async () => {
      const songs = await list();
      const expectedSongs = JSON.parse(
        getReplicatedFixture(fixtureReplicationFactor)
      ).slice(0, pageSize);
      expect(songs).toEqual(expectedSongs);
    });
    it('returns the right songs for a non-zero page', async () => {
      const secondPageSongs = await list({ pageNumber: 1 });
      const expectedSongs = JSON.parse(
        getReplicatedFixture(fixtureReplicationFactor)
      ).slice(pageSize * 1, pageSize * 2);
      expect(secondPageSongs).toEqual(expectedSongs);
    });
  });
});
