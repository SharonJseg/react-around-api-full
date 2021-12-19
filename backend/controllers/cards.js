const Card = require('../models/card');

const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');

const getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.status(200).send({ data: cards }))
    .catch(next);
};

const createCard = (req, res, next) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.status(200).send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadRequestError('card could not be created');
      }
    })
    .catch(next);
};

const deleteCard = (req, res, next) => {
  Card.findByIdAndRemove({ _id: req.params.cardId, owner: req.user._id })
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Could not find the card');
      }
      res.send({ data: card });
    })
    .catch(next);
};

const likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail(() => {
      throw new NotFoundError('Could Not find the card');
    })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new BadRequestError('Invalid card id');
      } else {
        next(err);
      }
    })
    .catch(next);
};

const dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail(() => {
      throw new NotFoundError('Could Not find the card');
    })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new BadRequestError('Invalid card id');
      } else {
        next(err);
      }
    })
    .catch(next);
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
