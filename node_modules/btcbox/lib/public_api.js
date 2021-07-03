var querystring = require('querystring');
var lp = require('./req_public').lp;
var constant = require('./constant');
var makeapi = function(api){
    return constant.BTCBOX_APIV1_URL + '/' + api;
}
var createEndPoint = function(apiv1, params){
    var qstring = querystring.stringify(params);
    return apiv1 + '/' + '?' + qstring;
}

var query = exports.query = function(method, params){
    return lp.req(createEndPoint(makeapi(method), params)).then(JSON.parse);
}

exports.ticker = function(pair){
    var params = { 'coin' : pair.split('_').shift() };
    return query('ticker', params);
}
exports.depth = function(pair){
    var params = { 'coin' : pair.split('_').shift() };
    return query('depth', params);
}
exports.orders = function(pair, opt){
    var params = { 'coin' : pair.split('_').shift(), 'since' : -1 };
    if(opt instanceof Object) Object.keys(opt).forEach(function(keys){ params[keys] = opt[keys] });
    return query('orders', params);
}
