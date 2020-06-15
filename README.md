# Install
You need node.js and yarn installed globally
`yarn`

## Run
`yarn start`
`node server.js`

Open [http://localhost:3000](http://localhost:3000) to view it in the browser.  
The page will reload if you make edits.  

## User Stories
Create simple `<OrderEntry />` and `<OrderBook />` components imported and rendered in `App.js`
### `<OrderEntry />`
- A toggle buy/sell button
- Inputs for `price` and `quantity`
- Submit button to POST http://localhost:3001/buy or http://localhost:3001/sell with `price` and `quantity` in the body (values from the inputs)

### `<OrderBook />`
- GET orders
  - http://localhost:3001/book will return `[price]: quantity` of buys and sells that have been POST'd
  ```json
    {
      buys: { 10: 100, 12: 20, 14: 24 },
      sells: { 15: 0, 20: 1000, 24: 10 },
    }
  ```
- Display the Order Book with DESC list of buys and ASC list of sells. Example:
![Screenshot](example.png)
- Refetch orders after every buy and sell POSTs
- Don't display entry if it has 0 quantity
