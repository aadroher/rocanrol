const { resolve } = require('path');

const publicDir = resolve(`${__dirname}/../public`);
const config = {
  publicDir,
  fileDir: `${publicDir}/files`,
  store: {
    filePath: resolve(`${__dirname}/../data/songs.json`),
  },
  pagination: {
    pageSize: 2,
    defaultPage: 0,
  },
};

module.exports = {
  getConfig: () => config,
};
