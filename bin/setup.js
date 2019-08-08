#!/usr/bin/env node

const fs = require('fs');
const signale = require('signale');
const { getConfig } = require('../src/config');
const databaseSeed = require('../data/seeds/songs.json');

const copyDatabaseFile = () =>
  new Promise((resolve, reject) => {
    const {
      store: { filePath },
    } = getConfig();
    const fileContents = JSON.stringify(databaseSeed, null, 2);
    fs.writeFile(filePath, fileContents, err => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });

const readFileDir = () =>
  new Promise((resolve, reject) => {
    const { fileDir } = getConfig();
    fs.readdir(fileDir, (err, fileNames) => {
      if (err) {
        reject(err);
      } else {
        resolve(fileNames);
      }
    });
  });

const checkAudioFiles = async () => {
  signale.pending('Checking the existence of the audio files...');
  const fileNames = await readFileDir();
  const missingFileNames = databaseSeed
    .filter(({ id }) => !fileNames.find(fileName => fileName === `${id}.ogg`))
    .map(({ id }) => `/public/files/${id}.ogg`);

  if (missingFileNames.length > 0) {
    signale.warn('The following autio files are missing:');
    missingFileNames.forEach(missingFileName => {
      signale.warn(missingFileName);
    });
  } else {
    signale.success('All audio files present! 🎸');
  }
};

const seedDatabase = async () => {
  signale.pending('Creating and seeding database...');
  try {
    await copyDatabaseFile();
    signale.success('Database successfully seeded! 🎉');
  } catch (err) {
    signale.fatal(err);
  }
};

const main = async () => {
  signale.start('Welcome to the Roncanrol server! 🤘');
  await seedDatabase();
  await checkAudioFiles();
  signale.complete('All done.');
};

main();
