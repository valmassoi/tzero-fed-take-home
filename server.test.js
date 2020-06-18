const expect = require('chai').expect;
const { placeBuyOrder, placeSellOrder, buys, sells } = require('./server')

describe('order matching engine', () => {
    describe('placeBuyOrder()', () => {
        it('add buy orders to the book', () => {
            placeBuyOrder('10', '100'); // should make these pure and reset the book beforeEach
            placeBuyOrder('10.01', '1000');
            placeBuyOrder('9.11', '200');
            expect(buys[10]).to.be.equal(100);
            expect(buys[10.01]).to.be.equal(1000);
            expect(buys[9.11]).to.be.equal(200);
        });
    });
    describe('placeSellOrder()', () => {
        it('add sell orders to the book (without matching buys)', () => {
            placeSellOrder('20', '25');
            placeSellOrder('20', '75');
            placeSellOrder('15', '50');
            placeSellOrder('12.02', '5000');
            expect(sells[20]).to.be.equal(100);
            expect(sells[15]).to.be.equal(50);
            expect(sells[12.02]).to.be.equal(5000);

            // buys from above stay on the book
            expect(buys[10]).to.be.equal(100);
            expect(buys[10.01]).to.be.equal(1000);
            expect(buys[9.11]).to.be.equal(200);
        });
    });
    describe('matching and price improvement', () => {
        it('sell order matches resting top of book buy, fully fills', () => {
            placeSellOrder('10.01', '100');
            expect(buys[10.01]).to.be.equal(900);
            expect(sells[10.01]).to.be.equal(0);
        })
        it('buy order matches resting top of book sell, fully fills', () => {
            placeBuyOrder('12.02', '1000');
            expect(sells[12.02]).to.be.equal(4000);
            expect(buys[12.02]).to.be.equal(0);
        })
        it('sell order gets price improvement, fully fills', () => {
            placeSellOrder('9.5', '950');
            expect(sells[9.5]).to.be.equal(0);
            expect(buys[10.01]).to.be.equal(0);
            expect(buys[10]).to.be.equal(50);
        })
        it('buy order gets price improvement, partial fills', () => {
            placeBuyOrder('17', '9000');
            expect(buys[17]).to.be.equal(4950);
            expect(sells[12.02]).to.be.equal(0);
            expect(sells[15]).to.be.equal(0);
        })
    })
});
