const expect = require('chai').expect;

const Card = require('../src/model/game/Card');
const { ranks, suits } = require('../src/model/util/data');
const Trick = require('../src/model/game/Trick');

describe('Validate Trick operations', () => {
    const trick = new Trick(5);
    const cards = [
        new Card(ranks.queen, suits.club),
        new Card(ranks.queen, suits.spade),
        new Card(ranks.queen, suits.heart),
        new Card(ranks.queen, suits.diamond),
        new Card(ranks.jack, suits.club),
        new Card(ranks.jack, suits.spade)
    ];

    beforeEach(() => {
        trick.clear();
    }); 

    it('can add cards to the trick one at a time', () => {
        cards.slice(0, 5).forEach(card => trick.add(card));
        expect(trick.getCards().length).to.equal(5);
    });

    it('throws an error when trying to add more that five cards to the trick', () => {
        expect(() => cards.forEach(card => trick.add(card))).to.throw(`Trick length cannot be greater than 5!`);
    });

    it('can sum the points in the trick', () => {
        cards.slice(0, 5).forEach(card => trick.add(card));
        expect(trick.sumPoints()).to.equal(14);
    });
});