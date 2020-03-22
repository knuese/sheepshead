class Bot {

    #hand;
    #cards;
    #order;
    #strategy;

    /**
     * Create a new bot
     * @param {string} name the name of the bot
     * @param {Function} strategy a strategy for the bot to use
     */
    constructor(name, strategy) {
        this.name = name;
        this.#strategy = strategy;
    }

    /**
     * Receive a dealt hand, returns whether the bot accepted the hand
     * @param {string} name the name of the bot
     * @param {Hand} hand the hand object that was dealt
     * @param {int} order the order where this player is in terms of picking
     */
    take(hand, order) {
        this.#hand = hand;
        this.#cards = hand.getCards();
        this.#order = order;

        return !hand.isMisdeal();
    }

    /**
     * Ask the bot if it wants to pick
     */
    wantsToPick() {
        console.log(`Bot ${this.name} is evaluating...`);
        console.log(`Received hand ${this.#hand.toString()}`);
        
        const willPick = this.#strategy(this.#cards, this.#order).pick();

        if (willPick) {
            console.log(`Bot ${this.name} wants to pick\n`);
        } else {
            console.log(`Bot ${this.name} wants to pass\n`);
        }

        return willPick;
    }

    /**
     * Ask the bot if it wants to crack
     */
    wantsToCrack() {
        console.log(`Bot ${this.name} is evaluating...`);
        console.log(`Received hand ${this.#hand.toString()}`);
        
        const willCrack = this.#strategy(this.#cards, this.#order).crack();

        if (willCrack) {
            console.log(`Bot ${this.name} wants to crack\n`);
        } else {
            console.log(`Bot ${this.name} will not crack\n`)
        }

        return willCrack;
    }
}

module.exports = Bot;