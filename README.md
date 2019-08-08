# 🤘 Rocanrol 

Rocanrol is a basic audio file server.

## Installation

### Node version

As specified in the `.nvmrc` file, this service has only been tested on Node 12.7. It may work in older (but modern) versions of Node, but run it on >12.0.0 for best results.

## Dependencies

As expected, the dependencies are installed by running:

```
npm install
```

## Audio data

_If_ you have a zip file with the audio files to be served for the database seed, you may extract it under the `public/` folder with the following commands from the root folder in a system running _macOS_.

```
cd public
cp /path/to/folder/rocanrol_songs.zip .
unzip -u rocanrol_songs.zip
```

This operation should have created the `public/files/` directory and populated with a collection of `.ogg` files.

## Setup

Before starting the service, it should be bootstrapped by calling:

```
npm run setup
```

This script does 2 things:

- Seeds the database. In other words it copies `data/seed/songs.json` to `data/songs.json`. This JSON file will act as a barebones database.
- Checks the existence of the audio files referrenced by the database records.

## Test

As usual, tests may be run with:

```
npm test
```

The tests generate a coverage report. Currently only `config.js`, `store.js` and `handler.js` under `src/` have acceptable test coverage.

## Run the service

To start the service, simply type:

```
npm start
```

And the service will be accessible at `localhost:3000`.
