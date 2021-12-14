const router = require('express').Router();
const {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');

const BASE_PATH = '/cards';

router.get(`${BASE_PATH}`, getCards);

router.post(`${BASE_PATH}`, createCard);

router.delete(`${BASE_PATH}/:cardId`, deleteCard);

router.put(`${BASE_PATH}/:cardId/likes`, likeCard);

router.delete(`${BASE_PATH}/:cardId/likes`, dislikeCard);

module.exports = router;
