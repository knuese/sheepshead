const Cards = require('./Cards');

class Trick extends Cards {
    #numPlayers;
    #maxCards;

    /**
     * Create a new trick
     * @param {Number} numPlayers the number of players in the game
     */
    constructor(numPlayers) {
        super();
        this.#numPlayers = numPlayers;
    }

    /**
     * Add a card to the trick
     * @param {Card} card the card to add 
     */
    add(card) {
        if (this.getCards().length + 1 > this.#numPlayers) {
            throw new Error(`Trick length cannot be greater than ${this.#numPlayers}!`);
        }

        super.add([card]);
    }
    
    /**
     * Get the number of points in the trick
     */
    sumPoints() {
        return this.getCards().reduce((acc, cur) => (acc + cur.getValue()), 0);
    }
}

module.exports = Trick;