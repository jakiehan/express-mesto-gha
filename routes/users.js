const router = require('express').Router();
const {
  getUsers,
  getUser,
  createUser,
  setUserInfo,
  setUserAvatar,
} = require('../controllers/users');

router.get('/users', getUsers);
router.get('/users/:userId', getUser);
router.post('/users', createUser);
router.patch('/users/me', setUserInfo);
router.patch('/users/me/avatar', setUserAvatar);

module.exports = router;
