const { ranks, suits } = require('../util/data');

const rankFactors = {
    [ranks.queen.id]: 3,
    [ranks.jack.id]: 2,
    [ranks.ace.id]: 0.8,
    [ranks.ten.id]: 0.75,
    [ranks.king.id]: 0.6,
    [ranks.nine.id]: 0.5,
    [ranks.eight.id]: 0.5,
    [ranks.seven.id]: 0.5,
}

const suitFactors = {
    [suits.club.id]: 0.4,
    [suits.spade.id]: 0.3,
    [suits.heart.id]: 0.2,
    [suits.diamond.id]: 0.1
}

const getMetrics = (cards) => {
    const trump = cards.filter(c => c.isTrump());

    return {
        numTrump: trump.length,
        numPoints: cards.reduce((acc, cur) => (acc + cur.getValue()), 0),
        power: trump.reduce((acc, cur) => (acc + rankFactors[cur.getRank().id] + suitFactors[cur.getSuit().id]), 0)
    };
}

const aggressive = (cards, order) => ({
    pick: () => {
        const { numTrump, numPoints, power } = getMetrics(cards);
        const confidence = power + (order / 5) + ((numTrump - 2.5) / 2) + (numPoints / 10);
        console.log(`Confidence level of ${confidence} for aggressive strategy`);
        return confidence >= 7.5;
    },
    crack: () => {
        const { numTrump, numPoints, power } = getMetrics(cards);
        const confidence = power + (order / 5) + ((numTrump - 2.5) / 2);
        console.log(`Confidence level of ${confidence} for aggressive strategy`);
        return confidence >= 8.25;
    }
})

const normal = (cards, order) => ({
    pick: () => {
        const { numTrump, power } = getMetrics(cards);
        const confidence = power + (order / 5) + ((numTrump - 2.5) / 2) + (numPoints / 10);
        console.log(`Confidence level of ${confidence} for normal strategy`);
        return confidence >= 8.5;
    },
    crack: () => {
        const { numTrump, power } = getMetrics(cards);
        const confidence = power + (order / 5) + ((numTrump - 2.5) / 2);
        console.log(`Confidence level of ${confidence} for normal strategy`);
        return confidence >= 9.75;
    }
})

const safe = (cards, order) => ({
    pick: () => {
        const { numTrump, numPoints, power } = getMetrics(cards);
        const confidence = power + (order / 5) + ((numTrump - 2.5) / 2) + (numPoints / 10);
        console.log(`Confidence level of ${confidence} for safe strategy`);
        return confidence >= 10;
    },
    crack: () => {
        const { numTrump, power } = getMetrics(cards);
        const confidence = power + (order / 5) + ((numTrump - 2.5) / 2);
        console.log(`Confidence level of ${confidence} for safe strategy`);
        return confidence >= 11.5;
    }
})

module.exports = {
    normal,
    aggressive,
    safe
}