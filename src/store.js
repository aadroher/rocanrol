const fs = require('fs');
const path = require('path');

const songsStoreFilePath = `${__dirname}/../data/songs.json`;

const readFile = filePath =>
  new Promise((resolve, reject) => {
    const normalisedPath = path.normalize(filePath);
    fs.readFile(normalisedPath, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });

const list = async () => readFile(songsStoreFilePath);

module.exports = {
  list,
};
