var btcbox = require('..');
var key = '';
var secret = '';

var api = btcbox.createPrivateApi(key,secret, '');
api.balance().delay(1000).then(console.log).then(function(){
    return api.wallet('btc').then(console.log);
})

