const { resolve } = require('path');

const publicDir = resolve(`${__dirname}/../public`);
const dataDir = resolve(`${__dirname}/../data`);
const config = {
  publicDir,
  fileDir: `${publicDir}/files`,
  store: {
    filePath: `${dataDir}/songs.json`,
  },
  pagination: {
    pageSize: 2,
    defaultPage: 0,
  },
};

module.exports = {
  getConfig: () => config,
};
