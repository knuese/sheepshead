const Blind = require('./Blind');
const Card = require('./Card');
const Hand = require('./Hand');
const { ranks, suits } = require('../util/data');

class Deck {

    #cards;

    constructor() {
        this.#cards = Object.values(suits).reduce((acc, suit) => {
            Object.values(ranks).forEach(rank => acc.push(new Card(rank, suit)));
            return acc;
        }, []);
    }

    /**
     * Get specific cards from the deck
     * @param criterion search criterion that can include rank, suit, and if the card is trump
     */
    getCards(criterion = {}) {
        let cards = this.#cards.slice();

        if (criterion.rank) {
            cards = cards.filter(c => c.getRank() === criterion.rank);
        }

        if (criterion.suit) {
            cards = cards.filter(c => c.getSuit() === criterion.suit);
        }

        if (criterion.isTrump === true) {
            cards = cards.filter(c => c.isTrump());
        } else if (criterion.isTrump === false) {
            cards = cards.filter(c => !c.isTrump());
        }

        if (cards.length === 0) {
            throw new Error(`No cards found for criterion ${JSON.stringify(criterion)}`);
        }

        return cards;
    }

    /**
     * Deal the cards into a specified number of hands
     * @param {Number} numHands the number of hands to deal
     */
    deal(numHands) {
        if (numHands !== 5) {
            throw new Error('Only five-handed games are supported!');
        }

        const cards = this.getCards();

        // Shuffle the cards
        for (let i = cards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [cards[i], cards[j]] = [cards[j], cards[i]];
        }

        const hands = [...Array(numHands).keys()].map(_ => new Hand(numHands));

        let blindSize = 32 % numHands;
        let blind = new Blind(numHands);
        const blindIndex = Math.floor(Math.random() * 13 + 1) * blindSize;
        blind.addCards(cards.splice(blindIndex, blindSize));

        // Deal the cards to each hand
        for (let i = 0; i < cards.length; i += 2) {
            hands[(i / 2) % numHands].addCards(cards.slice(i, i + 2));
        }

        return { hands, blind };
    }
}

module.exports = Deck;