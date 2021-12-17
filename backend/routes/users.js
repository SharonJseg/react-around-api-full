const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  getUsers,
  getUserById,
  updateUser,
  updateAvatar,
} = require('../controllers/users');

// const validateUrl = (string) => validator.isUrl(string);

router.get('/', getUsers);

router.get(
  '/me',
  celebrate({
    headers: Joi.object()
      .keys({
        authorization: Joi.string().required(),
      })
      .unknown(true),
  }),
  getUserById,
);

router.patch(
  '/me',
  celebrate({
    headers: Joi.object()
      .keys({
        authorization: Joi.string().required(),
      })
      .unknown(true),
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      about: Joi.string().required().min(2).max(30),
    }),
  }),
  updateUser,
);

router.patch(
  '/me/avatar',
  celebrate({
    headers: Joi.object()
      .keys({
        authorization: Joi.string().required(),
      })
      .unknown(true),
    body: Joi.object().keys({
      avatar: Joi.string().required().uri(),
      // avatar: Joi.string().required().custom(validateUrl),
    }),
  }),
  updateAvatar,
);

module.exports = router;
