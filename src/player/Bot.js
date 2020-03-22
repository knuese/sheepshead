const strategies = Object.values(require('./strategies'));

class Bot {

    #hand;
    #cards;
    #order;

    constructor(name) {
        this.name = name;
    }

    /**
     * Receive a dealt hand
     * @param {string} name the name of the bot
     * @param {Hand} hand the hand object that was dealt
     * @param {int} order the order where this player is in terms of picking
     */
    take(hand, order) {
        this.#hand = hand;
        this.#cards = hand.getCards();
        this.#order = order;
    }

    /**
     * Ask the bot if it wants to pick
     */
    wantsToPick() {
        console.log(`Bot ${this.name} is evaluating...`);
        console.log(`Received hand ${this.#hand.toString()}`);
        
        const willPick = strategies[Math.floor(Math.random() * 2) + 1](this.#cards, this.#order).pick();

        if (willPick) {
            console.log(`Bot ${this.name} wants to pick\n`);
        } else {
            console.log(`Bot ${this.name} wants to pass\n`);
        }

        return willPick;
    }

    wantsToCrack() {
        console.log(`Bot ${this.name} is evaluating...`);
        console.log(`Received hand ${this.#hand.toString()}`);
        
        const willCrack = strategies[Math.floor(Math.random() * 2) + 1](this.#cards, this.#order).crack();

        if (willCrack) {
            console.log(`Bot ${this.name} wants to crack\n`);
        } else {
            console.log(`Bot ${this.name} will not crack\n`)
        }

        return willCrack;
    }
}

module.exports = Bot;