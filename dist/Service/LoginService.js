'use strict';

var uuid = require('node-uuid');
var crypto = require("crypto");
var jwt = require('jwt-simple'); // Json Web Token 방식 사용할까
var moment = require('moment');

/*

사용될 리소스 코드 부분

var token = req.body.token || req.query.token || req.headers['x-access-token']; >> Request 받아서

*/

function encryption(auth, key, algorithm) {
    var hash = crypto.createHash(algorithm);
    var hashedContent = hash.update(auth + key);
    hashedContent = hash.digest('hex');
    return hashedContent;
}
//# sourceMappingURL=LoginService.js.map