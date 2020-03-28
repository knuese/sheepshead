const expect = require('chai').expect;

const Card = require('../src/model/game/Card');
const Hand = require('../src/model/game/Hand');
const { ranks, suits } = require('../src/model/util/data');

describe('Correctly manages a hand', () => {
    const hand = new Hand(5);

    beforeEach(() => {
        hand.clear();
    });

    it('cannot have more than 6 cards in a hand', () => {
        expect(() => hand.add([...Array(7).keys()].map(_ => new Card(ranks.queen, suits.diamond)))).to.throw(`Hand length cannot be greater than 6 for 5 players!`);
    });

    it('can be converted to a string', () => {
        hand.add([
            new Card(ranks.queen, suits.club),
            new Card(ranks.queen, suits.spade),
            new Card(ranks.ace, suits.diamond),
            new Card(ranks.eight, suits.diamond),
            new Card(ranks.king, suits.club),
            new Card(ranks.seven, suits.heart)
        ]);
        expect(hand.toString()).to.equal('♣Q ♠Q ♦A ♦8 ♣K ♥7');
    });

    it('can be cleared', () => {
        hand.add([
            new Card(ranks.queen, suits.club),
            new Card(ranks.queen, suits.spade),
            new Card(ranks.ace, suits.diamond),
            new Card(ranks.eight, suits.diamond),
            new Card(ranks.king, suits.club),
            new Card(ranks.seven, suits.heart)
        ]);

        hand.clear();
        expect(hand.getCards().length).to.equal(0, 'Hand should be empty after calling clear()');
    });

    it('isMisdeal() returns true when the hand is a misdeal', () => {
        hand.add([
            new Card(ranks.seven, suits.club),
            new Card(ranks.seven, suits.spade),
            new Card(ranks.seven, suits.heart),
            new Card(ranks.eight, suits.spade),
            new Card(ranks.eight, suits.club),
            new Card(ranks.eight, suits.heart)
        ]);

        expect(hand.isMisdeal(), 'Should be a misdeal when there are no points or trump').to.be.true;
    });

    it('isMisdeal() returns false when the hand has trump or points', () => {
        hand.add([
            new Card(ranks.seven, suits.club),
            new Card(ranks.seven, suits.spade),
            new Card(ranks.seven, suits.diamond),
            new Card(ranks.eight, suits.spade),
            new Card(ranks.eight, suits.club),
            new Card(ranks.eight, suits.heart)
        ]);

        expect(hand.isMisdeal(), 'The hand has trump').to.be.false;

        hand.clear();
        hand.add([
            new Card(ranks.seven, suits.club),
            new Card(ranks.seven, suits.spade),
            new Card(ranks.seven, suits.heart),
            new Card(ranks.eight, suits.spade),
            new Card(ranks.king, suits.club),
            new Card(ranks.eight, suits.heart)
        ]);

        expect(hand.isMisdeal(), 'The hand has points').to.be.false;
    });
});