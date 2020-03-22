const Cards = require('./Cards');

class Hand extends Cards {
    #numPlayers;
    #maxCards;

    /**
     * Create a new hand
     * @param {Number} numPlayers the number of players in the game
     */
    constructor(numPlayers) {
        super();
        this.#numPlayers = numPlayers;
        this.#maxCards = Math.floor(32 / numPlayers);
    }

    /**
     * Add cards to the hand
     * @param {[Card]} cards an array of cards to add 
     */
    add(cards) {
        if (this.getCards().length + cards.length > this.#maxCards) {
            throw new Error(`Hand length cannot be greater than ${this.#maxCards} for ${this.#numPlayers} players!`);
        }

        super.add(cards);
    }

    /**
     * Whether or not the hand is a misdeal
     */
    isMisdeal() {
        const cards = this.getCards();
        return cards.length === this.#maxCards &&
            cards.reduce((acc, cur) => (acc && !cur.isTrump() && cur.getValue() === 0), true);
    }
}

module.exports = Hand;