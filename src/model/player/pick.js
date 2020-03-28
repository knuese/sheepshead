const Cards = require('../game/Cards');
const { ranks, suits } = require('../util/data');

/**
 * Given an Cards object (includnig the blind), determine whether or not the player should go alone
 * @param {Cards} cards the Cards object
 */
const shouldGoAlone = (cards) => {
    if (cards.getCards().length !== 8) {
        throw new Error('shouldGoAlone() requires 8 cards; make sure the blind is included')
    }

    const trump = cards.getCards({ isTrump: true }).length;
    const hasQueenOfClubs = cards.getCards({ rank: ranks.queen, suit: suits.club }).length === 1;
    const queens = cards.getCards({ rank: ranks.queen }).length;
    const jacks = cards.getCards({ rank: ranks.jack }).length;
    const aces = cards.getCards({ rank: ranks.ace, isTrump: false }).length;
    const tens = cards.getCards({ rank: ranks.ten, isTrump: false }).length;

    // Indicators of a good hand
    const conditions = [
        hasQueenOfClubs,
        queens >= 3,
        queens === 4,
        queens >= 2 && jacks >= 3,
        queens >= 1 && jacks === 4 && trump >= 6,
        trump >= 5,
        trump >= 6,
        aces + tens === 2,
        aces === 2 && tens === 1
    ];

    return conditions.filter(c => c).length >= 3;
}

/**
 * Given a group of cards, pick a suit to call
 * @param {Cards} cards the collection of cards 
 */
const callSuit = (cards) => {
    const failSuits = [suits.club, suits.spade, suits.heart];

    let calledSuit;
    let suitsToCall = failSuits.reduce((acc, suit) => {
        const fail = cards.getCards({ suit, isTrump: false });
        if (fail.length > 0 && !fail.find(c => c.getRank() === ranks.ace)) {
            acc.push({suit, pts: fail.reduce((acc, cur) => (acc + cur.getValue()), 0), count: fail.length});
        }
        return acc;
    }, []);

    if (suitsToCall.length === 0) {
        const callableSuits = failSuits.filter(suit => cards.getCards({ suit, rank: ranks.ace }.length === 0));

        if (callableSuits.length === 0) {
            calledSuit = failSuits.slice().sort((a, b) => (cards.getCards({ suit: a, isTrump: false }).length - cards.getCards({ suit: b, isTrump: false }).length)).pop();
        } else {
            calledSuit = callableSuits[Math.floor(Math.random() * callableSuits.length)];
        }
    } else {
        if (suitsToCall.length > 1) {
            suitsToCall = suitsToCall.sort((a, b) => {
                if (a.pts >= 10 && b.pts >= 10) {
                    return b.count - a.count;
                } else if (a.pts >= 10) {
                    return 1;
                } else if (b.pts >= 10) {
                    return -1;
                } else {
                    return a.count === b.count
                        ? a.pts - b.pts
                        : a.count - b.count;
                }
            });
        }

        calledSuit = suitsToCall[0].suit;
    }

    return calledSuit;
}

/**
 * Bury two cards; the buried cards and the remaining hand are returned as arrays
 * @param {Cards} cards a Cards instance comprised of the Hand and the Blind
 * @param {*} calledSuit the suit that will be called
 */
const buryCards = (cards, calledSuit) => {
    const trump = cards.getCards({ isTrump: true });
    const queens = trump.filter(t => t.getRank() === ranks.queen).sort((a, b) => a.getRank().power - b.getRank().power);
    const jacks = trump.filter(t => t.getRank() === ranks.jack).sort((a, b) => a.getRank().power - b.getRank().power);
    const diamonds = trump.filter(c => c.getSuit() === suits.diamond && ![ranks.queen, ranks.jack].includes(c.getRank()))
                                .sort((a, b) => (b.getValue() - a.getValue()));
    const spades = cards.getCards({ isTrump: false, suit: suits.spade });
    const hearts = cards.getCards({ isTrump: false, suit: suits.heart });
    const clubs = cards.getCards({ isTrump: false, suit: suits.club });
    const fail = spades.concat(hearts).concat(clubs).sort((a, b) => (b.getValue() - a.getValue()));

    const ordered = fail.concat(diamonds).concat(jacks).concat(queens);

    // Get the first two candidates for burying
    const bury = [];

    for (let i = 0; bury.length < 2; i++) {
        const card = ordered[i];

        if (card.getSuit() === calledSuit && fail.filter(f => f.getSuit() === calledSuit).length === 1) {
            continue;
        }

        bury.push(card);
    }

    return { bury, newHand: ordered.filter(c => !bury.includes(c)) };
}

/**
 * Call a suit (or go alone) and bury cards
 * @param {[Card]} hand the array of cards representing the hand
 * @param {[Card]} blind the array of cards representing the blind
 */
const pick = (hand, blind) => {
    const cards = new Cards(hand.concat(blind));
    const calledSuit = shouldGoAlone(cards)
            ? 'Alone'
            : callSuit(cards);
    const { newHand, bury } = buryCards(cards, calledSuit);
    return { newHand, bury, calledSuit };
}

module.exports = {
    shouldGoAlone,
    callSuit,
    buryCards,
    pick
}