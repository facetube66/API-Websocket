var btcbox = require('..');
var constant = btcbox.Constant;
var apiv1 = btcbox.PublicApi;
var assert = require('assert');

var http = require('http');

constant.BTCBOX_APIV1_URL = 'http://localhost:3300/api/1'
var selfhost = function(proc){
    var sv = http.createServer(function(req, res){
        proc(req, res);
        res.end();
        sv.close();
    }).listen(3300);
}

selfhost(function(req, res){
    assert(req.url === '/api/1/depth/');
    res.write(JSON.stringify({
        asks:[[1001, 1.0],[1000,0.9]], bids:[[999,1.5],[998,2.2]]
    }));
});
apiv1.depth().then(function(v){
    assert(v.asks[0][0] === 1001);
    assert(v.asks[0][1] == 1.0);
    assert(v.asks[1][0] === 1000);
    assert(v.asks[1][1] == 0.9);
    assert(v.bids[0][0] === 999);
    assert(v.bids[0][1] == 1.5);
    assert(v.bids[1][0] === 998);
    assert(v.bids[1][1] == 2.2);
});

