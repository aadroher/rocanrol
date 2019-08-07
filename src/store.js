const fs = require('fs');
const path = require('path');

const {
  pagination: { pageSize },
  store: { filePath: songsStoreFilePath },
} = require('./config');

const readFile = filePath =>
  new Promise((resolve, reject) => {
    const normalisedPath = path.normalize(filePath);
    fs.readFile(normalisedPath, (err, data) => {
      if (err) {
        reject(err);
      } else {
        try {
          const parsedData = JSON.parse(data);
          resolve(parsedData);
        } catch (err) {
          reject(err);
        }
      }
    });
  });

const list = async ({ pageNumber }) => {
  const start = pageNumber * pageSize;
  const end = (pageNumber + 1) * pageSize;
  const allSongs = await readFile(songsStoreFilePath);
  return allSongs.slice(start, end);
};

module.exports = {
  list,
};
