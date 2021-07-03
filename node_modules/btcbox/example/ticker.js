var api = require('..').PublicApi;
api.ticker('btc').then(console.log).delay(1000).then(function(){
    return api.ticker('ltc').then(console.log)
}).delay(1000).then(function(){
    return api.ticker('doge').then(console.log)
})
