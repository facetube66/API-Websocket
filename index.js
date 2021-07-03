const WebSocket = require('ws');
var zlib = require("zlib");
var request = require('request');
var btcbox = require('btcbox');
var api = btcbox.PublicApi;

const ws_huobi = new WebSocket('wss://api-cloud.huobi.co.jp/ws');
const ws_okjap = new WebSocket('wss://connect.okcoin.jp:443/ws/v3');
const ws_login_okjap = new WebSocket('wss://connect.okcoin.jp:443/ws/v3');
const ws_gmo = new WebSocket("wss://api.coin.z.com/ws/public/v1");
const ws_zaif1 = new WebSocket("wss://ws.zaif.jp/stream?currency_pair=btc_jpy");
const ws_zaif2 = new WebSocket("ws://ws.zaif.jp/stream?currency_pair=btc_jpy");
const ws_zaif3 = new WebSocket("wss://ws.zaif.jp/stream?currency_pair=xem_jpy");
const ws_zaif4 = new WebSocket("ws://ws.zaif.jp/stream?currency_pair=xem_jpy");

var huobi_symbol = [];
var huobi_period = [];
var okjap_symbol = [];
var huobi_request = [];
var okjpa_request = [];
var btcbox_request = [];
var zaif_request = [];
var gmo_symbol = [];
var gmo_channel = [];

huobi_symbol = ['btcjpy', 'ethjpy', 'xrpjpy'];
okjap_symbol = ['BTC/JPY', 'ETH/JPY', 'XRP/JPY'];
huobi_period = ['1min', '5min', '15min', '30min', '60min', '4hour', '1day', '1mon', '1week', '1year'];
huobi_request = ['market', 'depth', 'trade', 'detail'];
okjpa_request = ['spot/depth', 'spot/depth5', 'spot/trade'];
btcbox_request = ['https://www.btcbox.co.jp/api/v1/tickers?coin=btc',
                  'https://www.btcbox.co.jp/api/v1/depth?coin=btc',
                  'https://www.btcbox.co.jp/api/v1/orders?coin=btc'
                 ];
zaif_request = ['btc_jpy', 'bch_jpy', 'eth_jpy', 'mona_jpy', 'xem_jpy', 'xym_jpy'];
gmo_channel = ['orderbooks', 'trades', 'ticker'];
gmo_symbol = ['BTC', 'ETH', 'BCH', 'LTC', 'XRP'];

//Connnect MySQL
const mysql = require('mysql');
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'ProchartBitFlyer'
});
connection.connect((err) => {
  if (err) throw err;
  console.log('Connected!');
});

//HUOBI API

//HUOBI market.$symbol.detail
/*ws_huobi.on('open', function open() {
    ws_huobi.send(JSON.stringify({
        "sub": "market." + huobi_symbol[0] + ".detail"
    }));
    ws_huobi.send(JSON.stringify({
        "sub": "market." + huobi_symbol[1] + ".detail"
    }));
    ws_huobi.send(JSON.stringify({
        "sub": "market." + huobi_symbol[2] + ".detail"
    }));
    ws_huobi.send(JSON.stringify({
        "sub": "market." + huobi_symbol[0] + ".trade.detail"
    }));
    zlib.gunzip(event.data,function(error, buff){
    ws_huobi.send(JSON.stringify({
        "sub": "market." + huobi_symbol[1] + ".trade.detail"
    }));
    ws_huobi.send(JSON.stringify({
        "sub": "market." + huobi_symbol[2] + ".trade.detail"
    }));
});

ws_huobi.addEventListener('message', function (event) {
       if(error != null){                                 
            console.log(error);
       }
       else{
            var str = buff.toString('utf8');                                             
            var parse = JSON.parse(str);
            console.log(parse);
        }
    });
});*/

//GMO API
// ws_gmo.on("open", function open() {
    // ws_gmo.send(JSON.stringify({
    //     "command": "subscribe", "channel": 'orderbooks', "symbol": 'BTC'
    // }));
    // ws_gmo.send(JSON.stringify({
    //     "command": "subscribe", "channel": 'orderbooks', "symbol": 'ETH'
    // }));
    // ws_gmo.send(JSON.stringify({
    //     "command": "subscribe", "channel": 'orderbooks', "symbol": 'BCH'
    // }));
    // ws_gmo.send(JSON.stringify({
    //     "command": "subscribe", "channel": 'orderbooks', "symbol": 'LTC'
    // }));
    // ws_gmo.send(JSON.stringify({
    //     "command": "subscribe", "channel": 'orderbooks', "symbol": 'XRP'
    // }));
    // ws_gmo.send(JSON.stringify({
    //     "command": "subscribe", "channel": 'trades', "symbol": 'BTC'
    // }));
    // ws_gmo.send(JSON.stringify({
    //     "command": "subscribe", "channel": 'trades', "symbol": 'ETH'
    // }));
    // ws_gmo.send(JSON.stringify({
    //     "command": "subscribe", "channel": 'trades', "symbol": 'BCH'
    // }));
    // ws_gmo.send(JSON.stringify({
    //     "command": "subscribe", "channel": 'trades', "symbol": 'LTC'
    // }));
    // ws_gmo.send(JSON.stringify({
    //     "command": "subscribe", "channel": 'trades', "symbol": 'XRP'
    // }));
    // ws_gmo.send(JSON.stringify({
    //     "command": "subscribe", "channel": 'ticker', "symbol": 'BTC'
    // }));
    // ws_gmo.send(JSON.stringify({
    //     "command": "subscribe", "channel": 'ticker', "symbol": 'ETH'
    // }));
    // ws_gmo.send(JSON.stringify({
    //     "command": "subscribe", "channel": 'ticker', "symbol": 'BCH'
    // }));
    // ws_gmo.send(JSON.stringify({
    //     "command": "subscribe", "channel": 'ticker', "symbol": 'LTC'
    // }));
    // ws_gmo.send(JSON.stringify({
    //     "command": "subscribe", "channel": 'ticker', "symbol": 'XRP'
    // }));   
// });

// ws_gmo.addEventListener('message', function (event) {
//     console.log(JSON.parse(event.data));
// });

//ZAIF API (PUBLIC and WEBSOCKET)
/*for(var i = 0;i < zaif_request.length;i ++)
{
    var headersOpt = {  
        "content-type" : "application/json",
    };

    request(
        {
            method : 'GET',
            url : 'https://api.zaif.jp/api/1/ticker/' + zaif_request[i],
            headers : headersOpt,
            json : true,
        }, function (error, response, body) {  
            console.log(body);  
    });
}*/

//WEBSOCKET
/*ws_zaif1.on('open', function open() {
    console.log("something");
});

ws_zaif1.on('message', function incoming(data) {
  // console.log(data.toString('utf8'));
  str = data.toString('utf8');
  console.log(JSON.parse(str));
  ws_zaif1.close();
});

ws_zaif2.on('open', function open() {
    console.log("something");
});

ws_zaif2.on('message', function incoming(data) {
  // console.log(data.toString('utf8'));
  str = data.toString('utf8');
  console.log(JSON.parse(str));
  ws_zaif2.close();
});

ws_zaif3.on('open', function open() {
    console.log("something");
});

ws_zaif3.on('message', function incoming(data) {
  // console.log(data.toString('utf8'));
  str = data.toString('utf8');
  console.log(JSON.parse(str));
  ws_zaif3.close();
});

ws_zaif4.on('open', function open() {
    console.log("something");
});

ws_zaif4.on('message', function incoming(data) {
  // console.log(data.toString('utf8'));
  str = data.toString('utf8');
  console.log(JSON.parse(str));
  ws_zaif4.close();
});*/



//OKJAP LOGIN API
/*var api_key = "985d5b66-57ce-40fb-b714-afc0b9787083";
var passphrase = "123456";
var timestamp = "1538054050.975";
var sign = "7L+zFQ+CEgGu5rzCj4+BdV2/uUHGqddA9pI6ztsRRPs=";

ws_login_okjap.on('open', function open() {
    ws_login_okjap.send(JSON.stringify({
        "op":"login",
        "args":[api_key,
                passphrase,
                timestamp,
                sign]}));
});

ws_login_okjap.addEventListener('message', function (event) {
    zlib.inflateRaw(event.data, function(err, buffer){
       if(err != null){                                 
            console.log(err);
       }
       else{
            ws_okjap.on('open', function open() {
                ws_okjap.send(JSON.stringify({"op": "subscribe", "args": "spot/order:LTC-JPY"}));
            });

            ws_okjap.addEventListener('message', function (event) {
                zlib.inflateRaw(event.data, function(err, buffer){
                    if(err != null){                                 
                        console.log(err);
                    }
                    else{
                        var str = buffer.toString('utf8');                                             
                        // var parse = JSON.parse(str);

                        console.log(str);
                    }
                });
            });
        }
    });
});*/

//BTCBOX NODE API
//BTCBOX API
/*console.log(btcbox_request[0]);
var headersOpt = {  
    "content-type": "application/json",
};

var cookie = {
    Name : 'cf_clearance',
    Content : 'cbb9ef6bd2faf67a915e268c86f903b0add5d219-1623074465-0-250',
    Domain : '.btcbox.co.jp',
    Path : '/'
};

request(
    {
        'Cookie': cookie,
        method:'GET',
        url:btcbox_request[2],
        headers: headersOpt,
        json: true,
    }, function (error, response) {  
        //Print the Response
        console.log(response.statusCode);  
});*/ 