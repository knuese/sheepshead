const expect = require('chai').expect;

const Card = require('../src/model/Card');
const Hand = require('../src/model/Hand');
const { ranks, suits } = require('../src/util/data');

describe('Correctly manages a hand', () => {
    let hand;

    beforeEach(() => {
        hand = new Hand(5);
    });

    it('cannot have more than 6 cards in a hand', () => {
        expect(() => hand.addCards([...Array(7).keys()].map(_ => new Card(ranks.queen, suits.diamond)))).to.throw(`Hand length cannot be greater than 6 for 5 players!`);
    });

    it('can be converted to a string', () => {
        hand.addCards([
            new Card(ranks.queen, suits.club),
            new Card(ranks.queen, suits.spade),
            new Card(ranks.ace, suits.diamond),
            new Card(ranks.eight, suits.diamond),
            new Card(ranks.king, suits.club),
            new Card(ranks.seven, suits.heart)
        ]);
        expect(hand.toString()).to.equal('♣Q ♠Q ♦A ♦8 ♣K ♥7');
    });
});