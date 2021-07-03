var api = require('..').PublicApi;
console.log('btc ===============================');
api.orders('btc').then(console.log).delay(1000).then(function(){
    console.log('ltc ===============================');
    return api.orders('ltc').then(console.log)
}).delay(1000).then(function(){
    console.log('doge ===============================');
    return api.orders('doge').then(console.log)
})
