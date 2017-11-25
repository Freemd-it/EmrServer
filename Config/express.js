

/**
 * Defendecies
 */

const express = require('express');
const session = require('express-session');
const compression = require('compression');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const cookieSession = require('cookie-session');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const csrf = require('csurf');
const cors = require('cors');
const path = require('path');
const flash = require('connect-flash');
const winston = require('winston');
const helpers = require('view-helpers');
const config = require('./');
const pkg = require('../package.json');

const env = process.env.NODE_ENV || 'sendbox';


/**
 * Expose
 */

module.exports = function (app, passport) {


    // Compression middleware (should be placed before express.static)
    app.use(compression({
        threshold: 512
    }))

    app.use(cors({
        origin: [config.server.accept_domain],
        optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
        credentials: true
    }));

    // Static files moddleware
    app.use(express.static(config.root + '/public'))

    // Use winston on production
    let log = 'dev';
    if (env !== 'developement') {
        log = {
            stream: {
                write: message => winston.info(message)
            }
        };
    }

    // Don't log during tests
    // Logging middleware
    if (env !== 'test') app.use(morgan(log));

    // Static files moddleware
    app.use(express.static(config.root + '/public'))
    app.set('views', path.join(config.root, 'src_view', 'views'));
    app.set('view engine', 'ejs');



    // bodyParser should be above methodOverride
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    // app.use(upload.single('image'));
    app.use(methodOverride(function (req) {
        if (req.body && typeof req.body === 'object' && '_method' in req.body) {
            // look in urlencoded POST bodies and delete it
            var method = req.body._method;
            delete req.body._method;
            return method;
        }
    }));

    // CookieParser should be above session
    app.use(cookieParser(config.server.cookie_secret));
    // app.use(cookieSession({ secret: config.server.cookie_secret }));
    app.use(session({
        secret: pkg.name,
        resave: false,
        saveUninitialized: true,
        store: new RedisStore({
            port: config.redis.redisPort,
            host: config.redis.redisHost,
            ttl: config.redis.ttl
        }),
        // cookie: { secure: true, maxAge: null, httpOnly: true },
    }));

    // use passport session
    app.use(passport.initialize());
    app.use(passport.session());

    // if (env !== 'test') {
    //     app.use(csrf());
    //     // This could be moved to view-helpers :-)
    //     app.use(function (req, res, next) {
    //         res.locals.csrf_token = req.csrfToken();
    //         next();
    //     });
    // }

    if (env === 'development') {
        app.locals.pretty = true;
    }

    /**
     * Hot reload
     */
    if (env === 'development') {
        const webpack = require('webpack');
        const webpackConfig = require(path.join(config.root, 'scripts/webpack.config.dev'));
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



    // connect flash for flash messages - should be declared after sessions
    app.use(flash());

    // should be declared after session and flash
    app.use(helpers(pkg.name));

}