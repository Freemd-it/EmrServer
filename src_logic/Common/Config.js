const fs = require("fs");
const path = require('path');

const root = path.join(__dirname, '../../');

var _serverConfigDir = path.join(root, "Config/server.conf");
var _storeConfigDir = path.join(root, "Config/store.conf");
var _redisConfigDir = path.join(root, "Config/redis.conf");
var _googleConfigDir = path.join(root, "Config/google.conf");

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
