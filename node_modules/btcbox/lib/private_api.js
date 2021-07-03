var crypto = require('crypto');
var querystring = require('querystring');
var constant = require('./constant');
var reason= require('./error_reason');
var lp = require('./req_public').lp;

var md5 = function(data){
    return crypto.createHash('md5').
        update(new Buffer(data)).
        digest('hex').toString();
}
var createSign = function(argo, key, qstring){
    return crypto.createHmac(argo, key).
        update(new Buffer(qstring)).
        digest('hex').toString();
};
var createHeader = function(user_agent, postdata){
    return {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': postdata.length,
        'User-Agent': user_agent,
    };
}
var createPostParam = function(objarray){
    var postparams = {};
    objarray.forEach(function(obj){
        Object.keys(obj).forEach(function(key){ postparams[key] = obj[key]; });
    });
    return postparams;
}
var createPostOption = function(url, api_key, secret_key, user_agent, nonce, method, params){
    var post = createPostParam([{nonce:nonce, key:api_key}, params]);
    var qstring = querystring.stringify(post);
    var poststring = [qstring, ['signature', createSign('sha256', secret_key, qstring)].join('=')].join('&');
    return {
        url: url + '/' + method + '/',
        method: 'POST',
        form: poststring,
        headers: createHeader(user_agent, poststring),
    };
}
var createPrivateApi = module.exports = function(api_key, secret_key, user_agent, nonce_func){
    var skey = md5(secret_key);
    var url = function(){ return constant.BTCBOX_APIV1_URL };
    var initnonce = new Date()/1000|0;
    nonce_func = nonce_func || function(){ return initnonce++; }
    var query = function(method, params){
        return lp.req(createPostOption(url(), api_key, skey, user_agent, nonce_func(), method, params)).
        then(JSON.parse).then(function(v){
            if('result' in v){
                if(v.result === true) return v;
                else if(v.result === false) throw(new Error(v.code+':'+reason.errorReason[v.code]));
            }else{
                return v;
            }
        });
    };
    return {
        query : query,
        balance : function(){
            return query('balance', {})
        },
        wallet : function(pair){
            return query('wallet', {'coin':pair.split('_').shift()})
        },
        tradeList : function(pair, opt){
            var params = {
                'coin':pair.split('_').shift(),
                'since':0,
                'type':'all',
            };
            if(opt instanceof Object) Object.keys(opt).forEach(function(key){ params[key] = opt[key] });
            return query('trade_list', params)
        },
        tradeView : function(pair, orderid){
            return query('trade_view', {
                'coin':pair.split('_').shift(),
                'id':orderid
            })
        },
        tradeCancel : function(pair, orderid){
            return query('trade_cancel', {
                'coin':pair.split('_').shift(),
                'id':orderid
            })
        },
        tradeAdd : function(pair, amount, price, type){
            return query('trade_add', {
                'coin':pair.split('_').shift(),
                'amount':amount,
                'price':price,
                'type':type
            })
        },
    };
}

