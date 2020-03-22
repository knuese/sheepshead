const expect = require('chai').expect;

const Bot = require('../src/player/Bot');
const Deck = require('../src/model/Deck');
const Hand = require('../src/model/Hand');
const { ranks, suits } = require('../src/util/data');
const strategies = Object.values(require('../src/player/strategies'));

describe('Bot plays correctly', () => {
    let deck;

    before(() => {
        deck = new Deck();
    });

    it('picks or cracks with a granny hand for all strategies', () => {
        const cards = deck.getCards({ rank: ranks.queen })
                            .concat(deck.getCards({ rank: ranks.jack, suit: suits.club }))
                            .concat(deck.getCards({ rank: ranks.jack, suit: suits.spade }));
        const hand = new Hand(5);
        hand.add(cards);

        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 5; j++) {
                const bot = new Bot('A', strategies[i]);
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
        const hand = new Hand(5);
        hand.add(cards);

        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 5; j++) {
                const bot = new Bot('A', strategies[i]);
                bot.take(hand, j);

                let result = bot.wantsToPick();
                expect(result, 'Should pass with a bad hand').to.be.false;

                result = bot.wantsToCrack();
                expect(result, 'Should not crack with a bad hand').to.be.false;
            }
        }
    });
});