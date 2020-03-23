const expect = require('chai').expect;

const Card = require('../src/model/Card');
const Cards = require('../src/model/Cards');
const { checkCards } = require('./util');
const { ranks, suits } = require('../src/util/data');
const { shouldGoAlone, callSuit, buryCards, pick } = require('../src/player/pick');

describe('Determine when the player should go alone', () => {
    it('goes alone with a granny hand', () => {
        const cards = new Cards([
            new Card(ranks.queen, suits.club),
            new Card(ranks.queen, suits.spade),
            new Card(ranks.queen, suits.heart),
            new Card(ranks.queen, suits.diamond),
            new Card(ranks.jack, suits.club),
            new Card(ranks.jack, suits.spade),
            new Card(ranks.ace, suits.heart),
            new Card(ranks.seven, suits.club),
        ]);
        expect(shouldGoAlone(cards)).to.be.true;
    });

    it('does not go alone with a questionable hand', () => {
        const cards = new Cards([
            new Card(ranks.queen, suits.club),
            new Card(ranks.queen, suits.spade),
            new Card(ranks.queen, suits.diamond),
            new Card(ranks.jack, suits.diamond),
            new Card(ranks.ten, suits.spade),
            new Card(ranks.king, suits.heart),
            new Card(ranks.seven, suits.club),
            new Card(ranks.eight, suits.club)
        ]);
        expect(shouldGoAlone(cards)).to.be.false;
    });

    it('throws an error if 8 cards are not passed', () => {
        const cards = new Cards([
            new Card(ranks.queen, suits.club),
            new Card(ranks.ace, suits.heart)
        ]);
        expect(() => shouldGoAlone(cards)).to.throw('shouldGoAlone() requires 8 cards; make sure the blind is included');
    });
});

describe('Calls the correct suit', () => {
    it('calls the fail suit if there is only one fail suit in the hand', () => {
        const cards = new Cards([
            new Card(ranks.queen, suits.club),
            new Card(ranks.jack, suits.spade),
            new Card(ranks.queen, suits.diamond),
            new Card(ranks.jack, suits.diamond),
            new Card(ranks.ten, suits.diamond),
            new Card(ranks.king, suits.club),
            new Card(ranks.seven, suits.club),
            new Card(ranks.eight, suits.club)
        ]);
        expect(callSuit(cards)).to.eql(suits.club);
    });

    it('does not call its own ace', () => {
        const cards = new Cards([
            new Card(ranks.queen, suits.club),
            new Card(ranks.jack, suits.spade),
            new Card(ranks.jack, suits.heart),
            new Card(ranks.jack, suits.diamond),
            new Card(ranks.ace, suits.diamond),
            new Card(ranks.ace, suits.club),
            new Card(ranks.seven, suits.club),
            new Card(ranks.eight, suits.heart)
        ]);
        expect(callSuit(cards)).to.eql(suits.heart);
    });

    it('calls the suit of which it has less points', () => {
        const cards = new Cards([
            new Card(ranks.queen, suits.club),
            new Card(ranks.jack, suits.spade),
            new Card(ranks.jack, suits.heart),
            new Card(ranks.jack, suits.diamond),
            new Card(ranks.ten, suits.diamond),
            new Card(ranks.ten, suits.heart),
            new Card(ranks.seven, suits.spade),
            new Card(ranks.king, suits.spade)
        ]);
        expect(callSuit(cards)).to.eql(suits.spade);
    });

    it('calls the suit of which it has fewer when there are no points', () => {
        const cards = new Cards([
            new Card(ranks.queen, suits.club),
            new Card(ranks.queen, suits.spade),
            new Card(ranks.jack, suits.club),
            new Card(ranks.jack, suits.diamond),
            new Card(ranks.seven, suits.heart),
            new Card(ranks.nine, suits.heart),
            new Card(ranks.eight, suits.heart),
            new Card(ranks.nine, suits.spade)
        ]);
        expect(callSuit(cards)).to.eql(suits.spade);
    });

    it('buries the suit of which it has more cards when points are equal', () => {
        const cards = new Cards([
            new Card(ranks.queen, suits.club),
            new Card(ranks.queen, suits.spade),
            new Card(ranks.jack, suits.club),
            new Card(ranks.jack, suits.diamond),
            new Card(ranks.ten, suits.diamond),
            new Card(ranks.ten, suits.heart),
            new Card(ranks.eight, suits.heart),
            new Card(ranks.ten, suits.spade)
        ]);
        expect(callSuit(cards)).to.eql(suits.heart);
    });
});

describe('Buries the right cards', () => {
    it('buries the most points', () => {
        const expectedHand = [
            new Card(ranks.queen, suits.club),
            new Card(ranks.queen, suits.spade),
            new Card(ranks.jack, suits.club),
            new Card(ranks.jack, suits.diamond),
            new Card(ranks.nine, suits.diamond),
            new Card(ranks.eight, suits.heart),
        ];

        const expectedBury = [
            new Card(ranks.ten, suits.heart),
            new Card(ranks.ten, suits.spade)
        ];

        const { bury, newHand } =  buryCards(new Cards(expectedHand.concat(expectedBury)), suits.heart);
        checkCards(expectedBury, bury);
        checkCards(expectedHand, newHand);
    });

    it('does not bury the called suit', () => {
        const expectedHand = [
            new Card(ranks.queen, suits.club),
            new Card(ranks.queen, suits.spade),
            new Card(ranks.jack, suits.club),
            new Card(ranks.jack, suits.diamond),
            new Card(ranks.nine, suits.diamond),
            new Card(ranks.ten, suits.heart),
        ];

        const expectedBury = [
            new Card(ranks.eight, suits.spade),
            new Card(ranks.ace, suits.spade)
        ];

        const { bury, newHand } =  buryCards(new Cards(expectedHand.concat(expectedBury)), suits.heart);
        checkCards(expectedBury, bury);
        checkCards(expectedHand, newHand);
    });

    it('buries the card of the called suit worth more points when possible', () => {
        const expectedHand = [
            new Card(ranks.queen, suits.club),
            new Card(ranks.queen, suits.spade),
            new Card(ranks.jack, suits.club),
            new Card(ranks.jack, suits.diamond),
            new Card(ranks.nine, suits.diamond),
            new Card(ranks.nine, suits.heart),
        ];

        const expectedBury = [
            new Card(ranks.ten, suits.heart),
            new Card(ranks.ace, suits.spade)
        ];

        const { bury, newHand } =  buryCards(new Cards(expectedHand.concat(expectedBury)), suits.heart);
        checkCards(expectedBury, bury);
        checkCards(expectedHand, newHand);
    });
});

describe('Calls and buries correctly given a hand and blind', () => {
    it('calls and buries the right cards', () => {
        const hand = [
            new Card(ranks.queen, suits.club),
            new Card(ranks.queen, suits.spade),
            new Card(ranks.jack, suits.club),
            new Card(ranks.king, suits.heart),
            new Card(ranks.nine, suits.diamond),
            new Card(ranks.ten, suits.spade)
        ];

        const blind = [
            new Card(ranks.king, suits.diamond),
            new Card(ranks.seven, suits.club)
        ];

        const expectedHand = [
            new Card(ranks.queen, suits.club),
            new Card(ranks.queen, suits.spade),
            new Card(ranks.jack, suits.club),
            new Card(ranks.king, suits.diamond),
            new Card(ranks.nine, suits.diamond),
            new Card(ranks.seven, suits.club)
        ];

        const expectedBury = [
            new Card(ranks.king, suits.heart),
            new Card(ranks.ten, suits.spade)
        ];

        const { newHand, bury, calledSuit } = pick(hand, blind);
        checkCards(expectedBury, bury);
        checkCards(expectedHand, newHand);
        expect(calledSuit).to.eql(suits.club);
    });

    it('goes alone with a good hand', () => {
        const hand = [
            new Card(ranks.queen, suits.club),
            new Card(ranks.queen, suits.spade),
            new Card(ranks.jack, suits.club),
            new Card(ranks.jack, suits.spade),
            new Card(ranks.jack, suits.heart),
            new Card(ranks.nine, suits.club)
        ];

        const blind = [
            new Card(ranks.seven, suits.heart),
            new Card(ranks.ace, suits.diamond)
        ];

        const expectedHand = [
            new Card(ranks.queen, suits.club),
            new Card(ranks.queen, suits.spade),
            new Card(ranks.jack, suits.club),
            new Card(ranks.jack, suits.spade),
            new Card(ranks.jack, suits.heart),
            new Card(ranks.ace, suits.diamond)
        ];

        const expectedBury = [
            new Card(ranks.seven, suits.heart),
            new Card(ranks.nine, suits.club)
        ];

        const { newHand, bury, calledSuit } = pick(hand, blind);
        expect(calledSuit).to.equal('Alone');
        checkCards(expectedBury, bury);
        checkCards(expectedHand, newHand);
    });
});