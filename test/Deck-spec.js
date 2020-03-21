const expect = require('chai').expect;

const Deck = require('../src/model/Deck');
const { ranks, suits } = require('../src/util/data');

describe('Validate Deck operations', () => {
    let deck;

    beforeEach(() => {
        deck = new Deck();
    });

    it('has 32 cards', () => {
        expect(deck.getCards().length).to.equal(32);
    })

    it('has 120 points', () => {
        expect(deck.getCards().reduce((acc, cur) => (acc + cur.getValue()), 0)).to.equal(120);
    });

    it('has 14 trump', () => {
        expect(deck.getCards({ isTrump: true }).length).to.equal(14, `Should have 14 trump`);
    });

    it('has 4 of each rank', () => {
        Object.values(ranks).forEach(rank => {
            let cards = deck.getCards({ rank });
            expect(cards.length).to.equal(4, `Should have 4 ${rank.id}s`);
        });
    });

    it('has 8 of each suit', () => {
        Object.values(suits).forEach(suit => {
            let cards = deck.getCards({ suit });
            expect(cards.length).to.equal(8, `Should have 8 ${suit.id}s`);
        });
    });

    it('can get a specific card', () => {
        const cards = deck.getCards({ rank: ranks.queen, suit: suits.club });
        expect(cards.length).to.equal(1, `Should only have one queen of clubs`);
    });

    it('throws an error if no cards are found', () => {
        const criterion = { rank: 'foo' };
        expect(() => deck.getCards(criterion)).to.throw(`No cards found for criterion ${JSON.stringify(criterion)}`);
    });

    it('can be dealt to five players', () => {
        let { hands, blind } = deck.deal(5);
        expect(hands.length).to.equal(5, `Should have 5 hands`);
        hands.forEach(hand => expect(hand.getCards().length).to.equal(6, `Should have 6 cards in each hand`));
        expect(blind.getCards().length).to.equal(2, `There should be 2 cards in the blind for 5 players`);
    });

    it('throws an error for a number of players other than 5', () => {
        expect(() => deck.deal(4)).to.throw('Only five-handed games are supported!');
    });
});