const expect = require('chai').expect;

const Card = require('../src/model/game/Card');
const Deck = require('../src/model/game/Deck');
const { ranks, suits } = require('../src/model/util/data'); 

describe('Correctly determines which card wins', () => {
    let deck;

    /**
     * Compare two cards and check the result with Chai
     * @param {Card} winner the card that should win
     * @param {Card} loser the card the should lose
     */
    const compare = (winner, loser) => {
        expect(Card.oneBeatsTwo(winner, loser), `${winner.getId()} should beat ${loser.getId()}`).to.be.true;

        // If both are fail this check doesn't make sense
        if (winner.isTrump() || loser.isTrump()) {
            expect(Card.oneBeatsTwo(loser, winner), `${loser.getId()} should lose to ${winner.getId()}`).to.be.false;
        }
    }
    
    before(() => {
        deck = new Deck();
    });

    it('compares trump against each other', () => {
        const queens = deck.getCards({ rank: ranks.queen })
                        .sort((a, b) => b.getSuit().power - a.getSuit().power);
        const jacks = deck.getCards({ rank: ranks.jack })
                        .sort((a, b) => b.getSuit().power - a.getSuit().power);
        const diamonds = deck.getCards({ suit: suits.diamond })
                        .filter(t => t.getRank() !== ranks.queen && t.getRank() !== ranks.jack)
                        .sort((a, b) => b.getRank().power - a.getRank().power);
        const nonQueens = jacks.concat(diamonds);

        queens.forEach(queen => {
            // All non-queens should lose to the queen
            nonQueens.forEach(card => compare(queen, card));

            // Check other queens against this queen
            queens.forEach(other => {
                if (queen !== other && queens.indexOf(queen) < queens.indexOf(other)) {
                    compare(queen, other);
                }
            });
        });

        jacks.forEach(jack => {
            // All diamonds should lose to the jack
            diamonds.forEach(diamond => compare(jack, diamond));

            // Compare the jacks against each other
            jacks.forEach(other => {
                if (jack !== other && jacks.indexOf(jack) < jacks.indexOf(other)) {
                    compare(jack, other)
                }
            });
        });

        diamonds.forEach(diamond => {
            // Compare the remaining diamonds against each other
            diamonds.forEach(other => {
                if (diamond !== other && diamonds.indexOf(diamond) < diamonds.indexOf(other)) {
                    compare(diamond, other);
                }
            });
        });
    });

    it('compares a trump and a fail', () => {
        const trump = deck.getCards({ isTrump: true });
        const fail = deck.getCards({ isTrump: false });

        trump.forEach(t => {
            fail.forEach(f => compare(t, f));
        });
    });

    it('compares fail suits', () => {
        const fail = deck.getCards({ isTrump: false });
        [suits.heart, suits.spade, suits.club].forEach(suit => {
            const others = fail.filter(f => f.getSuit() !== suit);
            const ofSuit = fail.filter(f => f.getSuit() === suit).sort((a, b) => b.getRank().power - a.getRank().power);
            ofSuit.forEach(card => {
                others.forEach(other => compare(card, other));
                ofSuit.forEach(other => {
                    if (card !== other && ofSuit.indexOf(card) < ofSuit.indexOf(other)) {
                        compare(card, other);
                    }
                });
            });
        });
    });

    it('throws an error when trying to compare a card against itself', () => {
        const card = deck.getCards({ rank: ranks.queen, suit: suits.heart })[0];
        expect(() => Card.oneBeatsTwo(card, card)).to.throw(`Cannot compare ${card.getId()} to itself!`)
    });

    it('maps a card to the proper image name', () => {
        const card = new Card(ranks.eight, suits.spade);
        expect(card.getImgName()).to.equal('8S');
    });
});