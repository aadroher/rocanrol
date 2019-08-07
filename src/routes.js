const express = require('express');
const router = express.Router();

const { list, methodNotAllowed } = require('./handler');

/* GET home page. */
router.get('/songs', list);

router.all('/songs', methodNotAllowed);

module.exports = router;
