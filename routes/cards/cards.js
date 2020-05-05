const router = require('express').Router();
const cardController = require('../../controllers/cards.js');

router.get('/', cardController.findCards);
router.get('/:cardId', cardController.getCardMiddeleware, cardController.findCardById);
router.delete('/:cardId', cardController.getCardMiddeleware, cardController.deleteCard);
router.post('/', cardController.createCard);
router.put('/:cardId/likes', cardController.likeCard);
router.delete('/:cardId/likes', cardController.dislikeCard);
module.exports = router;
