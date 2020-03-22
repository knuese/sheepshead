const Bot = require('./player/Bot');
const Deck = require('./model/Deck');

const deck = new Deck();
const { hands, blind } = deck.deal(5);

const bots = ['A', 'B', 'C', 'D', 'E'].map(name => (new Bot(name)));

hands.forEach((hand, i) => {
    bots[i].take(hand, i);
});

let i;
let picked = false;

for (i = 0; i < bots.length; i++) {
    picked = bots[i].wantsToPick();
    if (picked) {
        break;
    }
}

for (i = i + 1; i < bots.length; i++) {
    bots[i].wantsToCrack();
}

if (!picked) {
    console.log(`It's a doubler!`);
}

console.log(`The blind was ${blind.toString()}`);