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

const getPaginationInfo = ({ pageNumber, allSongs }) => {
  const start = pageNumber * pageSize;
  const end = (pageNumber + 1) * pageSize;
  const numSongs = allSongs.length;
  const numPages = Math.ceil(numSongs / pageSize);
  console.log({ numSongs, pageSize, numPages });
  return {
    start,
    end,
    numPages,
  };
};

const addAudioFileUrl = song => {
  const { id } = song;
  const fileUrl = `/files/${id}.ogg`;
  return {
    ...song,
    url: fileUrl,
  };
};

const list = async ({ pageNumber }) => {
  const allSongs = await readFile(songsStoreFilePath);
  const { start, end, numPages } = getPaginationInfo({ pageNumber, allSongs });
  const songs = allSongs.slice(start, end).map(addAudioFileUrl);
  return {
    pageNumber,
    numPages,
    songs,
  };
};

module.exports = {
  list,
};
