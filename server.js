const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors')

const app = express()

app.use(cors())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

const PORT = 3001
const responseDelay = 1500;

// [price]: quantity
const buys = {
}
const sells = {
}

app.get('/', (req, res) => res.send('Hello World!'))

app.get('/book', (req, res) => {
  // simulate delay
  setTimeout(() => {
    return res.json({ buys, sells })
  }, responseDelay)
})

app.post('/buy', (req, res) => {
  const { price: p, quantity: q } = req.body;
  if (!p || !q) {
    return res.status(400).send('Missing param(s)')
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
  // simulate delay
  setTimeout(() => {
    return res.status(200).send('Buy order placed.')
  }, responseDelay)
})

app.post('/sell', (req, res) => {
  const { price: p, quantity: q } = req.body;
  if (!p || !q) {
    return res.status(400).send('Missing param(s)')
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
  // simulate delay
  setTimeout(() => {
    return res.status(200).send('Sell order placed.')
  }, responseDelay)
})
app.get('*', (req, res) => res.sendStatus(404))

app.listen(PORT, () => console.log(`App listening at http://localhost:${PORT}`))