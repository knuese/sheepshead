const expect = require('chai').expect;

const Card = require('../src/model/Card');
const Cards = require('../src/model/Cards');
const { ranks, suits } = require('../src/util/data');

describe('Validate Cards operations', () => {
    let cards;
    
    before(() => {
        cards = new Cards();
        cards.add([
            new Card(ranks.queen, suits.club),
            new Card(ranks.seven, suits.diamond),
            new Card(ranks.eight, suits.heart)
        ]);
    });

    it('can get a specific card', () => {
        const result = cards.getCards({ rank: ranks.queen, suit: suits.club });
        expect(result.length).to.equal(1, `Should only have one queen of clubs`);
    });

    it('returns nothing if no cards are found', () => {
        const result = cards.getCards({ rank: 'foo' });
        expect(result.length).to.equal(0, 'No cards should be found for unknown rank');
    });

    it('removes a card from the collection and returns it when select() is called', () => {
        cards.add([new Card(ranks.queen, suits.spade)]);
        expect(cards.getCards().length).to.equal(4);

        const card = cards.select(ranks.queen, suits.spade);
        expect(card.getRank()).to.equal(ranks.queen);
        expect(card.getSuit()).to.equal(suits.spade);
        expect(cards.getCards().length).to.equal(3);
    });

    it('throws an error when select() is called for a missing card', () => {
        expect(() => cards.select(ranks.ten, suits.diamond)).to.throw('10♦ is not in the hand!');
    });
});