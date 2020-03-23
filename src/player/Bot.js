const Cards = require('../model/Cards');
const { ranks, suits } = require('../util/data');
const { pick } = require('./pick');

class Bot {

    #hand;
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
     * @param {Hand} hand the hand object that was dealt
     * @param {Number} order the order where this player is in terms of picking
     */
    take(hand, order) {
        this.#hand = hand;
        this.#order = order;

        return !hand.isMisdeal();
    }

    /**
     * Get the cards in the bot's hand
     */
    getHand() {
        return this.#hand.getCards();
    }

    /**
     * Ask the bot if it wants to pick
     */
    wantsToPick() {
        console.log(`Bot ${this.name} is evaluating...`);
        console.log(`Received hand ${this.#hand.toString()}`);
        
        const willPick = this.#strategy(this.#hand.getCards(), this.#order).pick();

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
        
        const willCrack = this.#strategy(this.#hand.getCards(), this.#order).crack();

        if (willCrack) {
            console.log(`Bot ${this.name} wants to crack\n`);
        } else {
            console.log(`Bot ${this.name} will not crack\n`)
        }

        return willCrack;
    }

    /**
     * Pick up the blind
     * @param {Blind} blind the blind to pick up
     */
    pick(blind) {
        console.log(`Bot ${this.name} picked up ${blind.toString()}`)

        // Call a suit and bury cards
        const { newHand, bury, calledSuit } = pick(this.#hand.getCards(), blind.getCards());

        this.#hand.clear();
        this.#hand.add(newHand);

        console.log(`Bot ${this.name} buried ${bury.map(b => b.getId())}`);
        console.log(`Bot ${this.name}'s hand after burying is ${this.#hand.toString()}`);
        console.log(`Bot ${this.name} called ${calledSuit.id}s`);

        return { bury, calledSuit };
    }
}

module.exports = Bot;