var Promise = require('bluebird');
var PublicApi = require('./public_api');

// 未約定がありステータスがcancelledでないものが有効な注文？
// tradeListで表示してほしい・・・
var openOrders = exports.openOrders = function(privateApi, pair, max){
    max = max || 10;
    return privateApi.tradeList(pair, {type:'all', since:max}).
        then(function(v){
            return v.filter(function(v){return v.amount_outstanding > 0})
        }).
        then(function(v){
            return Promise.all(v.map(function(v){
                return privateApi.tradeView(pair, v.id)
            })).then(function(v){
                return v.filter(function(v){return v.status !== 'cancelled'})
            })
        })
}

var cancelOrdersAll = exports.cancelOrdersAll = function(privateApi, pair){
    return openOrders(privateApi, pair).then(function(v){
        return Promise.all(v.map(function(v){return privateApi.tradeCancel(pair, v.id)}))
    })
}

var cancelOrders = exports.cancelOrders = function(privateApi, pair, type){
    return openOrders(privateApi, pair).then(function(v){
        return v.filter(function(v){return v.type === type})
    }).then(function(v){
        return Promise.all(v.map(function(v){return privateApi.tradeCancel(pair, v.id)}))
    })
}

var depth = exports.depth = function(pair){
    return PublicApi.depth(pair).then(function(v){
        return {
            bids:v.bids,
            asks:v.asks.reverse(),
        }
    });
}

