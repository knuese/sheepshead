const Hand = require('./Hand');

class Blind extends Hand {
    /**
     * Create a new blind
     * @param {Number} numPlayers the number of players in the game
     */
    constructor(numPlayers) {
        super(32 % numPlayers);
    }
}

module.exports = Blind;