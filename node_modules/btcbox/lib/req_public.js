var LimitRequestPromise = require('limit-request-promise');
var constant = require('./constant');

var lp = exports.lp = new LimitRequestPromise(1, 1);
lp.setup([
    {
        host:constant.BTCBOX_APIV1_URL, max:1, sec:1,
    }
]);
