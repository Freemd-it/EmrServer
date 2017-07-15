var fs = require("fs");

var _serverConfigDir = "./Config/server.conf";
var _storeConfigDir = "./Config/store.conf";
var _redisConfigDir = "./Config/redis.conf";
var _googleConfigDir = "./Config/google.conf";

var _serverConfigRaw = fs.readFileSync(_serverConfigDir, 'ascii');
var _serverConfig = JSON.parse(_serverConfigRaw);

var _storeConfigRaw = fs.readFileSync(_storeConfigDir, 'ascii');
var _storeConfig = JSON.parse(_storeConfigRaw);

var _redisConfigRaw = fs.readFileSync(_redisConfigDir, 'ascii');
var _redisConfig = JSON.parse(_redisConfigRaw);

var _googleConfigRaw = fs.readFileSync(_googleConfigDir, 'ascii');
var _googleConfig = JSON.parse(_googleConfigRaw);

exports.serverConfig = _serverConfig;
exports.storeConfig = _storeConfig;
exports.redisConfig = _redisConfig;
exports.googleConfig = _googleConfig;
