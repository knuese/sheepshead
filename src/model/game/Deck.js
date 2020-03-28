const Blind = require('./Blind');
const Cards = require('./Cards');
const Card = require('./Card');
const Hand = require('./Hand');
const { ranks, suits } = require('../util/data');

class Deck extends Cards {
    /**
     * Create a new deck; the cards are added automatically
     */
    constructor() {
        super();
        super.add(Object.values(suits).reduce((acc, suit) => {
            Object.values(ranks).forEach(rank => acc.push(new Card(rank, suit)));
            return acc;
        }, []));
    }

    /**
     * Deal the cards into a specified number of hands
     * @param {Number} numHands the number of hands to deal
     */
    deal(numHands) {
        if (numHands !== 5) {
            throw new Error('Only five-handed games are supported!');
        }

        let cards = this.getCards();

        // Shuffle the cards
        for (let i = cards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [cards[i], cards[j]] = [cards[j], cards[i]];
        }

        // Don't forget to cut
        const cutIndex = Math.floor(Math.random() * 30 + 1);
        cards = cards.slice(cutIndex).concat(cards.slice(0, cutIndex));

        const hands = [...Array(numHands).keys()].map(_ => new Hand(numHands));

        let blind = new Blind();
        const blindIndex = Math.floor(Math.random() * 13 + 1) * 2;
        blind.add(cards.splice(blindIndex, 2));

        // Deal the cards to each hand
        for (let i = 0; i < cards.length; i += 2) {
            hands[(i / 2) % numHands].add(cards.slice(i, i + 2));
        }

        return { hands, blind };
    }

    /**
     * Does nothing
     */
    add() { }

    /**
     * Does nothing
     */
    select() { }

    /**
     * Does nothing
     */
    clear() { }
}

module.exports = Deck;