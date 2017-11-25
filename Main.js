var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var os = require('os');
var cluster = require('cluster');
var compression = require('compression');
var util = require('util');
var domain = require('domain').create();
var methodOverride = require('method-override');
var traceback = require('traceback');
var http = require('http');
var process = require('process');

var config = require('./Config');
var sessionService = require('./src_logic/Service/SessionService.js');
var passportService = require('./src_logic/Service/PassportService.js');
// var redisService = require('./src_logic/Service/RedisService.js');
var routesService = require('./src_logic/Service/RoutesService.js');
var entityService = require('./src_logic/Service/EntityService.js');


const env = process.env.NODE_ENV || 'development';

global.app = new express();


var cpuNo = os.cpus().length;
cluster.schedulingPolicy = cluster.SCHED_RR; // 라운드 로빈 방식으로 클러스터링 방식 지정

var Cluster = function () { };

Cluster.Master = function () {

    console.log("## Master Cluster Start ##");

    // for(var i = 0; i < cpuNo; i++){
    for (var i = 0; i < 1; i++) {

        var worker = cluster.fork();
    }



    cluster.on("disconnect", function (worker) {

        console.log(util.format("## [master] worker id : %d exit successfully ##", worker.id));
    });

    cluster.on("exit", function (worker, code, signal) {

        console.log("## [master] worker process id : " + worker.process.id + " died ##");
    });

    cluster.on("uncaughtException", function (error) {

        console.log("## [master] server uncaughtexception ##");
        console.log("## [master] uncaughtexception : " + error + " ##");
        console.log("## [master] error call stack : " + error.stack + " ##");

        var stack = traceback();
        for (var i = 0; i < stack.length; i++) {

            console.log("## [master] callbackstack : " + i + " function : " + stack[i].name + " at line : " + stack[i].line + " ##");
        }
    });
}

Cluster.Worker = function (workerId) {

    domain.on("error", function (error) {

        try {
            console.log(util.format("## [worker][%d] server uncaughtexception ##", workerId));
            console.log(util.format("## [worker][%d] uncaughtexception : " + error + " ##", workerId));
            console.log(util.format("## [worker][%d] error call stack : " + error.stack + " ##", workerId));

            var stack = traceback();
            for (var i = 0; i < stack.length; i++) {

                console.log("## [worker] callbackstack : " + i + " function : " + stack[i].name + " at line : " + stack[i].line + " ##");
            }
            cluster.worker.disconnect();
        }
        catch (exception) {

            console.log(util.format("## [worker][%d] server uncaughtexception ##", workerId));
            console.log(util.format("## [worker][%d] uncaughtexception : " + error + " ##", workerId));
            console.log(util.format("## [worker][%d] error call stack : " + error.stack + " ##", workerId));

            var stack = traceback();
            for (var i = 0; i < stack.length; i++) {

                console.log("## [worker] callbackstack : " + i + " function : " + stack[i].name + " at line : " + stack[i].line + " ##");
            }
        }
    });

    process.on("exit", function () {

        console.log("## [worker][%d] process about to exit ##", workerId);
    });

    domain.run(function () {

        try {

            Cluster.ProcessRun(workerId);
        }
        catch (exception) {

            console.log(util.format("## [worker][%d] error call stack : " + exception.stack + " ##", workerId));
        }
    });
}

Cluster.ProcessRun = function (workerId) {

    app.set('port', process.env.PORT || config.serverConfig.port);

    app.use(compression());
    app.use(passportService.passport.initialize());
    app.use(passportService.passport.session());
    app.use(cookieParser(config.serverConfig.cookie_secret));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(methodOverride());
    app.set('trust proxy', config.serverConfig.trust_proxy_host);


    // Static files moddleware
    app.use(express.static(__dirname + '/public'))
    app.set('views', path.join(__dirname, 'src_view', 'views'));
    app.set('view engine', 'ejs');


    sessionService.Init();
    routesService.Init();
    passportService.Init();
    entityService.Init(); // 테이블 생성



    /**
     * Hot reload
     */
    if (env === 'development') {
        const webpack = require('webpack');
        const webpackConfig = require(path.join(__dirname, 'scripts/webpack.config.dev'));
        const compiler = webpack(webpackConfig);
        const devMiddleware = require("webpack-dev-middleware")(compiler, {
            noInfo: true, publicPath: webpackConfig.output.publicPath
        })

        const hotMiddleware = require("webpack-hot-middleware")(compiler, {
            log: false, heartbeat: 10 * 1000
        });

        compiler.plugin("compilation", compilation => {
            compilation.plugin("html-webpack-plugin-after-emit", (__data, cb) => {
                hotMiddleware.publish({ action: "reload" });
                cb();
            })
        })

        app.use(devMiddleware);
        app.use(hotMiddleware);
    }

    http.createServer(app).listen(app.get('port'), function () {
        console.log(util.format('## [processRun] [pid:%d] [childNo:%d] Server running at %d ##', process.pid, workerId, config.serverConfig.port));
    });
}

if (cluster.isMaster) Cluster.Master();
else Cluster.Worker(cluster.worker.id);
