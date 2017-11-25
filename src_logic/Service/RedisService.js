var ioRedis = require('ioredis');
var util = require('util');
var config = require('../Common/Config.js');

var RedisService = function(){};

RedisService.session = new ioRedis(
{
    port: config.redisConfig.redisPort,
    host: config.redisConfig.redisHost,
    password: config.redisConfig.redisPassword,
    db: 0,

    retryStrategy: function (times) {
        var delay = Math.min(times * 2, 2000);
        console.log(delay);
        return delay;
    }
});

  console.log(util.format("## redis started ##"));


module.exports = RedisService;
