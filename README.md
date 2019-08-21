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
cp /path/to/folder/more_rocanrol_songs.zip .
unzip -u more_rocanrol_songs.zip
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

## API

Currently the service only offers one endpoint for one HTTP verb.

- `GET /songs?page={page_number}`

  The `/songs` collection lists all songs present in the system's database.

  Query string parameters:
    - `page`: (Optional) A string parseable as an integer that indicates the page number of the `/songs` collection that needs to be retrieved. The current page size is 2.

  Response body:

    - `page_number`: An integer indicating the page retrieved.
    - `num_pages`: An integer representing the total number of non-empty pages.
    - `songs`: An array of objects, each representing the metadata for one of the songs in the system. Their attributes are all strings, and they indicate:
      - `id`: A unique slug that identifies the song.
      - `title`: The title of the song.
      - `author`: The name of the author of the song.
      - `album`: The name of the album thios song was published in.
      - `publisher`: The name of the record label that published the album.
      - `url`: A site-relative URL to the audio file with the song.

  For example:

  ```{json}
  {
    "page_number": 1,
    "num_pages": 3,
    "songs": [
        {
            "id": "el_pesol_ferestec-merce",
            "title": "Mercè",
            "author": "El Pèsol Feréstec",
            "album": "Mercè",
            "publisher": "La Castanya",
            "url": "/files/el_pesol_ferestec-merce.ogg"
        },
        {
            "id": "l_hereu_escampa-consol_condol",
            "title": "Consol, Condol",
            "author": "L'Hereu Escampa",
            "album": "S/T",
            "publisher": "Famèlic Records",
            "url": "/files/l_hereu_escampa-consol_condol.ogg"
        }
    ]
  }
  ```

## Internal architechture

Rocanrol is a service build on top of [Express](https://expressjs.com/).

For any received request, the call stack follows the path:

```
route -> handler -> store -> file system
```

Since the functionality is currently extremely simple, no common logic has been abstacted out.

The `src/config.js` file includes the global parameters to configure the execution of the service. Among others, it includes:

- The filesystem path of audio files.
- The filesystem path the database file.
- The page size.
- The default page.


## What is missing

Even under the minimal scope of a single collection list GET endpoint, there are still outstanding tasks that would need to be done in order to consider this service as production ready. There are some of them:

- The routes definition is to restrictive by allowinf none but the GET and HEAD methods. One would expect OPTIONS to return an informative answer.
- There is no actioal validation for the value of the `page` query string parameter. I have yet to consider if it needs any.
- All errors that take place in the `hander.list` function are communicated to the client as a simple 500 innternal server error, but the error message is passed down to the response body. Not only is this not secure enough, since it may show internal information but it would be more informative if there was a more granular mapping between errors and HTTP error codes and messages.
- The syncronization between the `url` values in the song records and the actual files in the system is not robust enough. This value should be null or not present, if there is no corresponding audio file.
  
   




