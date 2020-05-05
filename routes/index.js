const router = require('express').Router();
const users = require('./users/user.js');
const cards = require('./cards/cards.js');

router.use('/cards', cards);
router.use('/users', users);

module.exports = router;
