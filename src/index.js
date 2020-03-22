const Bot = require('./player/Bot');
const Deck = require('./model/Deck');
const strategies = Object.values(require('./player/strategies'));

const bots = ['A', 'B', 'C', 'D', 'E'].map(name => {
    const strategy = strategies[Math.floor(Math.random() * 3)];
    return new Bot(name, strategy);
});

const deck = new Deck();
const { hands, blind } = deck.deal(5);
let validDeal = true;

for (let h = 0; h < hands.length; h++) {
    validDeal &= bots[h].take(hands[h], h);
}

if (validDeal) {
    let i;
    let someonePicked = false;

    for (i = 0; i < bots.length; i++) {
        someonePicked = bots[i].wantsToPick();
        if (someonePicked) {
            break;
        }
    }

    for (i = i + 1; i < bots.length; i++) {
        bots[i].wantsToCrack();
    }

    if (!someonePicked) {
        console.log(`It's a doubler!`);
    }
} else {
    console.log(`It's a misdeal!`);
}

console.log(`The blind was ${blind.toString()}`);