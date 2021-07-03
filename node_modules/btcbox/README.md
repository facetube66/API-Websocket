node-btcbox
===========

btcbox is bitcoin and major altcoin exchange market.
You can be automated trading using this module.  

install
-------

```
npm install btcbox
```

api document
------------
https://www.btcbox.co.jp/help/api.html

Public API
----------

module prepare
```
var btcbox = require('btcbox');
var api = btcbox.PublicApi;
```

ticker(pair)
pair format : btc or btc_jpy
```
api.ticker('btc').then(console.log)
{ high: 37998,
  low: 36010,
  buy: 36600,
  sell: 37523,
  last: 37500,
  vol: 141.7408 }
```

depth(pair)
```
api.depth('btc').then(console.log)
{ asks: 
   [ [ 61500, 0.3216 ],
     [ 61160, 0.017 ],
     [ 60980, 0.03 ],
     [ 60000, 0.1924 ],
     [ 55900, 1.4 ],
     [ 55100, 2 ],
     [ 37848, 2.96 ],
     [ 37847, 2 ],
     [ 37523, 1.113 ] ],
  bids: 
   [ [ 36600, 0.2 ],
     [ 36510, 0.5 ],
     [ 36500, 3.084 ],
     [ 36101, 0.089 ],
     [ 36100, 3.352 ],
     [ 20001, 0.05 ],
     [ 10000, 1 ],
     [ 460, 10 ] ] }
```

trades(pair)
```
api.orders('btc').then(console.log)
[ { date: '1397042522',
    price: 48000,
    amount: 0.0232,
    tid: '2',
    type: 'sell' },
  { date: '1397042556',
    price: 48000,
    amount: 0.033,
    tid: '3',
    type: 'sell' },
  { date: '1397050402',
    price: 35000,
    amount: 0.032,
    tid: '4',
    type: 'sell' },
  { date: '1398144061',
    price: 54000,
    amount: 0.225,
    tid: '498',
    type: 'buy' },
  { date: '1398144074',
    price: 54500,
    amount: 0.531,
    tid: '499',
    type: 'buy' },
  { date: '1398144102',
    price: 54950,
    amount: 0.15,
    tid: '500',
    type: 'buy' },
  { date: '1398146829',
    price: 54950,
    amount: 0.101,
    tid: '501',
    type: 'buy' } ]
```

Private API
-----------

edit config.json
```
{
 "apikey" : "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
 "secretkey" : "yyyyyyyyyyyyyyyyyyyyyyyyyyyyyy"
}
```

module prepare
```
var btcbox = require('btcbox');
var Promise = require('bluebird');
var fs = Promise.promisifyAll(require('fs'));

fs.readFileAsync('./config.json').then(JSON.parse).
then(function(config){
    var api = btcbox.createPrivateApi(config.apikey, config.secretkey, 'user agent is node-btcbox');
    // call api
}).catch(console.log);
```

balance()
```
api.balance().then(console.log);
{ uid: 99999,
  nameauth: 2,
  moflag: 0,
  btc_balance: 0,
  btc_lock: 0,
  ltc_balance: 0,
  ltc_lock: 0,
  doge_balance: 0,
  doge_lock: 0,
  jpy_balance: 100000,
  jpy_lock: 0 }
```

wallet(pair)
```
api.wallet('btc').then(console.log)
{ result: true, address: 'btcaddress' }
```

tradeList(pair, option)
```
api.tradeList(pair).then(console.log);
[ { id: '8888',
    datetime: '2014-10-31 03:12:15',
    type: 'sell',
    price: 37000,
    amount_original: 1.5,
    amount_outstanding: 0 } ]
```

tradeView(id)
```
api.tradeView('8888').then(console.log);
{ id: 8888,
  datetime: '2014-10-31 03:12:15',
  type: 'sell',
  price: 37000,
  amount_original: 1.5,
  amount_outstanding: 0,
  status: 'all',
  trades: 
   [ { trade_id: '99999',
       amount: 1.5,
       price: 37000,
       datetime: '2014-10-31 03:12:15',
       fee: 0 } ] }
```

tradeCancel(orderid)
```
api.tradeCancel('8888').then(console.log);
{"result":true, "id":"8888"}
```

tradeAdd(pair, amount, price, type)
```
api.tradeAdd('btc', 1.5, 37000, 'sell').then(console.log);
{"result":true, "id":"8888"}
```


License
-------

MIT License

Donate
------
bitcoin:1GLnWVBpadWnHpxf8KpXTQdwMdHAWtzNEw  
monacoin:MCEp2NWSFc352uaDc6nQYv45qUChnKRsKK  


