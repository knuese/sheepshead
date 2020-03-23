const Cards = require('./Cards');

class Hand extends Cards {
    #numPlayers;
    #maxCards;

    /**
     * Create a new hand
     * @param {Number} numPlayers the number of players in the game
     * @param {[Card]} cards an array of cards to initialize the hand
     */
    constructor(numPlayers, cards = []) {
        super(cards);
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
        // Check if the hand has 6 fail worth no points
        return this.getCards({ isTrump: false }).filter(c => c.getValue() === 0).length === this.#maxCards;
    }
}

module.exports = Hand;