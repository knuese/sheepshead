const express = require('express');
const router = express.Router();

const Deck = require('../model/game/Deck');

router.get('/new', (req, res) => {
    console.log('Received request')
    const deck = new Deck();
    const { hands } = deck.deal(5);
    const cards = hands[0].getCards().map(c => c.getImgName());
    console.log(`Sending back ${cards}`);
    res.send({ cards });
});

module.exports = router;