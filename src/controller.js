const { list: listSongs } = require('./store');

const list = async (req, res, next) => {
  // console.log(req);
  const { query: { page } = {} } = req;
  const pageNumber = parseInt(page, 10);
  try {
    const songs = await listSongs({ pageNumber });
    res.status(200).send({
      page: pageNumber,
      songs,
    });
  } catch ({ message }) {
    res.status(500).send({
      message,
    });
  }
};

module.exports = {
  list,
};
