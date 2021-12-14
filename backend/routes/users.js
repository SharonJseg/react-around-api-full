const router = require('express').Router();
const {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  updateAvatar,
} = require('../controllers/users');

const BASE_PATH = '/users';

router.get(`${BASE_PATH}`, getUsers);

router.get(`${BASE_PATH}/:id`, getUserById);

router.post(`${BASE_PATH}`, createUser);

router.patch(`${BASE_PATH}/me`, updateUser);

router.patch(`${BASE_PATH}/me/avatar`, updateAvatar);

module.exports = router;
