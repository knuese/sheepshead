module.exports = {
    ranks: Object.freeze({
        seven: { id: '7', pts: 0, power: 1 },
        eight: { id: '8', pts: 0, power: 2 },
        nine: { id: '9', pts: 0, power: 3 },
        king: { id: 'K', pts: 4, power: 4 },
        ten: { id: '10', pts: 10, power: 5 },
        ace: { id: 'A', pts: 11, power: 6 },
        jack: { id: 'J', pts: 2, power: 7 },
        queen: { id: 'Q', pts: 3, power: 8 }
    }),
    suits: Object.freeze({
        diamond: { id: '♦', power: 1 },
        heart: { id: '♥', power: 2 },
        spade: { id: '♠', power: 3 },
        club: { id: '♣', power: 4 },
    })
}