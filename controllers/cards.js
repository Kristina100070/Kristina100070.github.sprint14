const cardModel = require('../models/card');

const findCards = (req, res, next) => cardModel.find({})
  .then((card) => {
    res.json(card);
  })
  .catch((err) => {
    next(err);
  });

const createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  const card = cardModel.create({ name, link, owner })
    // eslint-disable-next-line no-shadow
    .then((card) => {
      res.json(card);
    })
    .catch((err) => {
      next(err);
    });
  return card;
};

const getCardMiddeleware = (req, res, next) => cardModel.findOne({
  _id: req.params.cardId,
})
// eslint-disable-next-line consistent-return
  .then((card) => {
    if (!card) {
      return next({ status: 404, massage: 'Card not found' });
    }
    req.card = card;
    next();
  })
  .catch((err) => {
    next(err);
  });

const findCardById = (req, res) => {
  res.json(req.card);
};

const deleteCard = (req, res, next) => cardModel.remove({ _id: req.params.cardId })
  // eslint-disable-next-line consistent-return
  .then((card) => {
    if (String(card.owner) !== req.user._id) {
      return next({ status: 404, massage: 'Вы не автор карточки' });
    }
    res.json(card);
  })
  .catch(next);

const likeCard = (req, res) => {
  // eslint-disable-next-line max-len
  cardModel.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      // eslint-disable-next-line no-undef
      next(err);
    });
};

const dislikeCard = (req, res) => {
  // eslint-disable-next-line max-len
  cardModel.findByIdAndUpdate(req.params.cardId, { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      // eslint-disable-next-line no-undef
      next(err);
    });
};
module.exports = {
  findCards,
  createCard,
  getCardMiddeleware,
  findCardById,
  deleteCard,
  likeCard,
  dislikeCard,
};
