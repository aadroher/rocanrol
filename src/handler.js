const {
  pagination: { defaultPage },
} = require('./config');
const { list: listSongs } = require('./store');

const methodNotAllowed = (req, res, next) => {
  const message = 'Method Not Allowed';
  res.status(405).json({
    message,
  });
};

const list = async (req, res, next) => {
  const {
    query: { page = defaultPage },
  } = req;
  const pageNumber = parseInt(page, 10);
  try {
    const songs = await listSongs({ pageNumber });
    res.status(200).json({
      page: pageNumber,
      songs,
    });
  } catch ({ message }) {
    res.status(500).json({
      message,
    });
  }
};

module.exports = {
  list,
  methodNotAllowed,
};
