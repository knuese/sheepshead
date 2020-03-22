const Cards = require('./Cards');

class Blind extends Cards {
    /**
     * Add cards to the blind
     * @param {[Card]} cards an array of cards to add 
     */
    add(cards) {
        if (this.getCards() + cards.length > 2) {
            throw new Error(`Blind cannot have more than 2 cards!`);
        }

        super.add(cards);
    }
}

module.exports = Blind;