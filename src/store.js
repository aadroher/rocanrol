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
        try {
          const parsedData = JSON.parse(data);
          resolve(parsedData);
        } catch (err) {
          reject(err);
        }
      }
    });
  });

const list = async () => readFile(songsStoreFilePath);

module.exports = {
  list,
};
