const expect = require('chai').expect;

const Blind = require('../src/model/Blind');
const Bot = require('../src/player/Bot');
const Card = require('../src/model/Card');
const { checkCards } = require('./util');
const Deck = require('../src/model/Deck');
const Hand = require('../src/model/Hand');
const { ranks, suits } = require('../src/util/data');
const strategies = require('../src/player/strategies');
const strategyArray = Object.values(strategies);

describe('Bot plays correctly', () => {
    let deck;

    before(() => {
        deck = new Deck();
    });

    it('picks or cracks with a granny hand for all strategies', () => {
        const cards = deck.getCards({ rank: ranks.queen })
                            .concat(deck.getCards({ rank: ranks.jack, suit: suits.club }))
                            .concat(deck.getCards({ rank: ranks.jack, suit: suits.spade }));
        const hand = new Hand(5, cards);

        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 5; j++) {
                const bot = new Bot('A', strategyArray[i]);
                bot.take(hand, j);

                let result = bot.wantsToPick();
                expect(result, 'Should pick with a granny hand').to.be.true;

                result = bot.wantsToCrack();
                expect(result, 'Should crack with a granny hand').to.be.true;
            }
        }
    });

    it('does not pick or crack for a bad hand', () => {
        const cards = deck.getCards({ rank: ranks.seven })
                            .concat(deck.getCards({ rank: ranks.ace, suit: suits.club }))
                            .concat(deck.getCards({ rank: ranks.ten, suit: suits.spade }));
        const hand = new Hand(5, cards);

        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 5; j++) {
                const bot = new Bot('A', strategyArray[i]);
                bot.take(hand, j);

                let result = bot.wantsToPick();
                expect(result, 'Should pass with a bad hand').to.be.false;

                result = bot.wantsToCrack();
                expect(result, 'Should not crack with a bad hand').to.be.false;
            }
        }
    });

    it('can pick, call, and bury', () => {
        const hand = new Hand(5, [
            new Card(ranks.jack, suits.club),
            new Card(ranks.jack, suits.spade),
            new Card(ranks.jack, suits.heart),
            new Card(ranks.jack, suits.diamond),
            new Card(ranks.ten, suits.club),
            new Card(ranks.eight, suits.club)
        ]);
        
        const blind = new Blind([
            new Card(ranks.king, suits.diamond),
            new Card(ranks.ace, suits.heart)
        ]);

        const expectedHand = [
            new Card(ranks.jack, suits.club),
            new Card(ranks.jack, suits.spade),
            new Card(ranks.jack, suits.heart),
            new Card(ranks.jack, suits.diamond),
            new Card(ranks.king, suits.diamond),
            new Card(ranks.eight, suits.club)
        ];

        const expectedBury = [
            new Card(ranks.ten, suits.club),
            new Card(ranks.ace, suits.heart)
        ]
        
        const bot = new Bot('A', strategies.aggressive);
        bot.take(hand, 4);

        const { bury, calledSuit } = bot.pick(blind);
        checkCards(expectedBury, bury);
        checkCards(expectedHand, bot.getHand());
        expect(calledSuit).to.equal(suits.club);
    });
});