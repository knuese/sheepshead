const expect = require('chai').expect;

/**
 * Compare two arrays of cards to see if they are the same
 * @param {[Card]} expected the expected cards
 * @param {[Card]} actual the actual cards
 */
const checkCards = (expected, actual) => {
    expected.forEach(card => {
        expect(actual.findIndex(c => c.getId() === card.getId()) >= 0, `${card.getId()} should be in the array`).to.be.true;
    });
}

module.exports = {
    checkCards
}