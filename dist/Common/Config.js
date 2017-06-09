"use strict";

var fs = require("fs");

var _serverConfigDir = "./config/server.conf";
var _storeConfigDir = "./config/store.conf";
var _redisConfigDir = "./config/redis.conf";

var _serverConfigRaw = fs.readFileSync(_serverConfigDir, 'ascii');
var _serverConfig = JSON.parse(_serverConfigRaw);

var _storeConfigRaw = fs.readFileSync(_storeConfigDir, 'ascii');
var _storeConfig = JSON.parse(_storeConfigRaw);

var _redisConfigRaw = fs.readFileSync(_redisConfigDir, 'ascii');
var _redisConfig = JSON.parse(_redisConfigRaw);

exports.serverConfig = _serverConfig;
exports.storeConfig = _storeConfig;
exports.redisConfig = _redisConfig;
//# sourceMappingURL=Config.js.map