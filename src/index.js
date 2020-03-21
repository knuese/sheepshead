const Deck = require('./model/Deck');

const deck = new Deck();
const { hands, blind } = deck.deal(5);

hands.forEach(hand => {
    console.log(hand.toString());
});

console.log(blind.toString());