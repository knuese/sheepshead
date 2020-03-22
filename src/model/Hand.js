const Card = require('./Card');

class Hand {
    #cards;
    #numPlayers;
    #maxCards;

    /**
     * Create a new hand
     * @param {Number} numPlayers the number of players in the game
     */
    constructor(numPlayers) {
        this.#cards = [];
        this.#numPlayers = numPlayers;
        this.#maxCards = Math.floor(32 / numPlayers);
    }

    /**
     * Add cards to the hand
     * @param {[Card]} cards an array of cards to add 
     */
    addCards(cards) {
        if (this.#cards.length + cards.length > this.#maxCards) {
            throw new Error(`Hand length cannot be greater than ${this.#maxCards} for ${this.#numPlayers} players!`);
        }

        // Add the cards
        this.#cards.push(...cards);

        // Sort the cards to be in the right order
        this.sort();
    }

    /**
     * Get the cards in the hand
     */
    getCards() {
        return this.#cards.slice();
    }
    
    /**
     * Remove all cards from the hand
     */
    clear() {
        this.#cards.length = 0;
    }

    /**
     * Sort the cards in the hand in descending order
     */
    sort() {
        this.#cards.sort((one, two) => {
            let oneComesFirst;
            
            if (!one.isTrump() && !two.isTrump() && one.getSuit() !== two.getSuit()) {
                // If they are both fail of different suits, just sort by the suit
                oneComesFirst = one.getSuit().power > two.getSuit().power;
            } else {
                // Otherwise see which card wins
                oneComesFirst = Card.oneBeatsTwo(one, two);
            }
            
            return oneComesFirst ? -1 : 1;
        });
    }

    /**
     * Whether or not the hand is a misdeal
     */
    isMisdeal() {
        return this.#cards.length === this.#maxCards &&
            this.#cards.reduce((acc, cur) => (acc && !cur.isTrump() && cur.getValue() === 0), true);
    }

    /**
     * Convert the hand to a string
     */
    toString() {
        return this.#cards.reduce((acc, cur) => (`${acc === '' ? '' : `${acc} `}${cur.getId()}`), '');
    }
}

module.exports = Hand;