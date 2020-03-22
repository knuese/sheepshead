const Card = require('./Card');

class Cards {
    #cards;

    /**
     * Create a collection of cards
     */
    constructor() {
        this.#cards = [];
    }

    /**
     * Add cards to the collection
     * @param {[Card]} cards the cards to add
     */
    add(cards) {
        this.#cards.push(...cards);
        this.sort();
    }

    /**
     * Get the cards in the collection
     */
    getCards() {
        return this.#cards.slice();
    }

    /**
     * Remove all cards from the collection
     */
    clear() {
        this.#cards.length = 0;
    }

    /**
     * Sort the cards in the collection in descending order
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
     * Convert the hand to a string
     */
    toString() {
        return this.#cards.reduce((acc, cur) => (`${acc === '' ? '' : `${acc} `}${cur.getId()}`), '');
    }
}

module.exports = Cards;