const uuid = require('node-uuid');
const crypto = require("crypto");
const util = require('util');

const config = require('../../Config');


var Common = function () { };

/* freemed 소문자 -> sha512 해시 = auth_key  */

Common.Encryption = function (description, algorithm) {

    var cipher = crypto.createCipher(algorithm, config.server.auth_key);
    var encipherContent = cipher.update(description, 'utf8', 'hex');
    encipherContent += cipher.final('hex');
    return encipherContent;
}

/* EX) common.Encryption(description, 'aes-256-ctr') */

Common.Decryption = function (description, algorithm) {

    var decipher = crypto.createDecipher(algorithm, config.server.auth_key);
    var decipherContent = decipher.update(description, 'hex', 'utf8');
    decipherContent += decipher.final('utf8');
    return decipherContent;
}

/* EX) common.Decryption(description, 'aes-256-ctr') */

Common.Hashing = function (description, algorithm) {

    var hash = crypto.createHash(algorithm);
    var hashedContent = hash.update(config.server.auth_key + description);
    hashedContent = hash.digest('hex');
    return hashedContent;
}

/* EX) common.Hashing(description, 'ripemd160WithRSA') */



module.exports = Common;
