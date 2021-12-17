const router = require('express').Router();
const { Joi, celebrate } = require('celebrate');

const {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');

router.get('/', getCards);

router.post(
  '/',
  celebrate({
    headers: Joi.object()
      .keys({
        authorization: Joi.string().required(),
      })
      .unknown(true),
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      link: Joi.string().required().uri(),
    }),
  }),
  createCard,
);

router.delete(
  '/:cardId',
  celebrate({
    headers: Joi.object()
      .keys({
        authorization: Joi.string().required(),
      })
      .unknown(true),
    params: Joi.object().keys({
      cardId: Joi.string().length(24).alphanum().required(),
    }),
  }),
  deleteCard,
);

router.put(
  '/:cardId/likes',
  celebrate({
    headers: Joi.object()
      .keys({
        authorization: Joi.string().required(),
      })
      .unknown(true),
    params: Joi.object().keys({
      cardId: Joi.string().length(24).alphanum().required(),
    }),
  }),
  likeCard,
);

router.delete(
  '/:cardId/likes',
  celebrate({
    headers: Joi.object()
      .keys({
        authorization: Joi.string().required(),
      })
      .unknown(true),
    params: Joi.object().keys({
      cardId: Joi.string().length(24).alphanum().required(),
    }),
  }),
  dislikeCard,
);

module.exports = router;
