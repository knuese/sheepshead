const expect = require('chai').expect;

const Blind = require('../src/model/game/Blind');
const Card = require('../src/model/game/Card');
const { ranks, suits } = require('../src/model/util/data');

describe('Validate Blind operations', () => {
    it('throws an error when trying to put more than 2 cards in the blind', () => {
        const blind = new Blind();
        const cards = [
            new Card(ranks.queen, suits.club),
            new Card(ranks.queen, suits.spade),
            new Card(ranks.queen, suits.heart)
        ];

        expect(() => blind.add(cards)).to.throw('Blind cannot have more than 2 cards!');
    });
});