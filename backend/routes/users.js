const router = require('express').Router();
const {
  getUsers,
  getUserById,
  updateUser,
  updateAvatar,
} = require('../controllers/users');

const BASE_PATH = '/users';

router.get(`${BASE_PATH}`, getUsers);

router.get(`${BASE_PATH}/:id`, getUserById);

router.patch(`${BASE_PATH}/me`, updateUser);

router.patch(`${BASE_PATH}/me/avatar`, updateAvatar);

module.exports = router;
