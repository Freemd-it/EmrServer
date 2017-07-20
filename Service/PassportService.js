var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

var config = require('../Common/Config.js');

var PassportService = function(){};

PassportService.Init = function(app){

    passport.use(new GoogleStrategy({
          clientID : config.googleConfig.google_client_id,
          clientSecret : config.googleConfig.google_client_password,
          callbackURL : "http://localhost:3000/auth/google/callback"
        },
        function(accessToken, refreshToken, profile, done) {

            /* TODO 1. User.findAndCreate */
            /* TODO 2. Session Managing */
            console.log(profile._json);
            return done(null, profile);

        }
    ));
};

passport.serializeUser(function(user, done) {

    done(null, user);
});

passport.deserializeUser(function(obj, done) {

    done(null, obj);
});

PassportService.passport = passport;
module.exports = PassportService;
