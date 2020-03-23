const Card = require('./Card');

class Cards {
    #cards;

    /**
     * Create a collection of cards
     * @param {[Card]} cards an optional array of cards to initialize the collection
     */
    constructor(cards = []) {
        this.#cards = cards;
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
     * Remove a card from the collection and return it
     * @param {Object} rank the rank of the card 
     * @param {Object} suit the suit of the card
     */
    select(rank, suit) {
        const index = this.#cards.findIndex(c => c.getRank() === rank && c.getSuit() === suit);

        if (index < 0) {
            throw new Error(`${rank.id}${suit.id} is not in the hand!`);
        }

        return this.#cards.splice(index, 1)[0];
    }

    /**
     * Get specific cards from the deck
     * @param options search options that can include rank, suit, and if the card is trump
     */
    getCards(options = {}) {
        let cards = this.#cards.slice();

        if (options.rank) {
            cards = cards.filter(c => c.getRank() === options.rank);
        }

        if (options.suit) {
            cards = cards.filter(c => c.getSuit() === options.suit);
        }

        if (options.isTrump === true) {
            cards = cards.filter(c => c.isTrump());
        } else if (options.isTrump === false) {
            cards = cards.filter(c => !c.isTrump());
        }

        return cards;
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