const express = require('express')
const bodyParser = require('body-parser');
const app = express()
app.use(bodyParser.urlencoded({ extended: true }));

const PORT = 3001

// [price]: quantity
const buys = {
}
const sells = {
}

app.get('/', (req, res) => res.send('Hello World!'))

app.get('/book', (req, res) => {
  res.json({ buys, sells })
})

app.post('/buy', (req, res) => {
  const { price: p, quantity: q } = req.body;
  if (!p || !q) {
    res.sendStatus(400)
  }
  const price = Number(p)
  let quantity = Number(q)
  // match with sells
  const sellPrices = Object.keys(sells).sort((a, b) => a - b)
  if (sellPrices.length > 0) {
    let i = 0;
    let loopPrice = sellPrices[i]
    while (quantity > 0 && loopPrice <= price) {
      // price improvement!
      const quantityAtLoopPrice = sells[loopPrice];
      const quantityToMatchAtPrice = Math.min(quantity, quantityAtLoopPrice);
      sells[loopPrice] = sells[loopPrice] - quantityToMatchAtPrice;
      quantity -= quantityToMatchAtPrice;
      i++;
      loopPrice = sellPrices[i];
    }
  }

  const prevBuysAtPrice = buys[price] || 0
  buys[price] = prevBuysAtPrice + quantity;
  res.send('Buy order placed.')
})

app.post('/sell', (req, res) => {
  const { price: p, quantity: q } = req.body;
  if (!p || !q) {
    res.sendStatus(400)
  }
  const price = Number(p)
  let quantity = Number(q)
  // match with buys
  const buyPrices = Object.keys(buys).sort((a, b) => b - a)
  if (buyPrices.length > 0) {
    let i = 0;
    let loopPrice = buyPrices[i]
    while (quantity > 0 && loopPrice >= price) {
      // price improvement!
      const quantityAtLoopPrice = buys[loopPrice];
      const quantityToMatchAtPrice = Math.min(quantity, quantityAtLoopPrice);
      buys[loopPrice] = buys[loopPrice] - quantityToMatchAtPrice;
      quantity -= quantityToMatchAtPrice;
      i++;
      loopPrice = buyPrices[i];
    }
  }

  const prevSellsAtPrice = sells[price] || 0
  sells[price] = prevSellsAtPrice + quantity;
  res.send('Sell order placed.')
})

app.listen(PORT, () => console.log(`App listening at http://localhost:${PORT}`))