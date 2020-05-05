const router = require('express').Router();
const userController = require('../../controllers/users.js');

router.get('/', userController.findUser);
router.get('/:userId', userController.findUserById);
router.patch('/me', userController.updateProfile);
router.patch('/me/avatar', userController.updateAvatar);

module.exports = router;
