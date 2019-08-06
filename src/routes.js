const express = require('express');
const router = express.Router();

const { list } = require('./controller');

/* GET home page. */
router.get('/songs', list);

module.exports = router;
