var api = require('..').PublicApi;
console.log('btc ===============================');
api.depth('btc').then(console.log).delay(1000).then(function(){
    console.log('ltc ===============================');
    return api.depth('ltc').then(console.log)
}).delay(1000).then(function(){
    console.log('doge ===============================');
    return api.depth('doge').then(console.log)
})
