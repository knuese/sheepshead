const { ranks, suits } = require('../util/data');

class Card {
    #rank;
    #suit;
    #id;
    #value;
    #isTrump;
    #power;

    /**
     * Create a new card
     * @param {Object} rank the rank of the card
     * @param {Object} suit the suit of the card
     */
    constructor(rank, suit) {
        this.#rank = rank;
        this.#suit = suit;
        this.#id = `${suit.id}${rank.id}`;
        this.#value = rank.pts;
        this.#isTrump = rank.id === ranks.jack.id || 
            rank.id === ranks.queen.id || 
            suit.id === suits.diamond.id;
        this.#power = { suit: suit.power, rank: rank.power };
    }

    /**
     * Get the rank of the card
     */
    getRank() {
        return this.#rank;
    }

    /**
     * Get the suit of the card
     */
    getSuit() {
        return this.#suit;
    }

    /**
     * Get the point value of the card
     */
    getValue() {
        return this.#value;
    }

    /**
     * Whether or not the card is trump
     */
    isTrump() {
        return this.#isTrump;
    }

    /**
     * Get the power value of the card
     */
    getPower() {
        return {...this.#power};
    }

    /**
     * Gets the ID of the card
     */
    getId() {
        return this.#id;
    }

    /**
     * See if card 1 beats card 2
     * @param {Card} one the first card that was played
     * @param {Card} two the second card that was played
     */
    static oneBeatsTwo(one, two) {
        if (one.getId() === two.getId()) {
            throw new Error(`Cannot compare ${one.getId()} to itself!`);
        }
    
        let beats;
    
        // First check if both have the same trump status
        if (one.isTrump() === two.isTrump()) {
            const first = one.getPower();
            const second = two.getPower();
    
            if (one.isTrump()) {
                // Both are trump, first check if the ranks are the same
                beats = first.rank === second.rank
                    ? first.suit > second.suit // yes, compare suit power
                    : first.rank > second.rank; // no, compare rank power
            } else {
                // Neither are trump, check if they are the same suit
                beats = one.getSuit().id === two.getSuit().id
                    ? first.rank > second.rank // yes, compare rank power
                    : true; // no, the first card wins so return true
            }
        } else {
            // One of the cards is trump and the other isn't
            beats = one.isTrump();
        }
    
        return beats;
    }
}

module.exports = Card;