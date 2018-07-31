var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var redis = require('./RedisService')

const _ = require('lodash')

var config = require('../../Config');

var PassportService = function(){};

PassportService.Init = function(app){

    passport.serializeUser(function(user, done) {
        done(null, user);
    });

    passport.deserializeUser(function(user, done) {
        done(null, user);
    });

    passport.use(new GoogleStrategy({
          clientID : config.google.google_client_id,
          clientSecret : config.google.google_client_password,
          callbackURL : "/auth/google/callback"
        },
        function(accessToken, refreshToken, profile, done) {

            if(profile._json.domain) {

              return done(null, profile)

              // const key = profile._json.emails[0].value
              // redis.findAndCreate(key)
              //   .then(result => {
              //     if(result === 'OK' || 'ALREADY') return done(null, profile)
              //   })
              //   .catch(error => {
              //     console.log(error)
              //   })
            } else {
              profile._json.domain = 'other.domain'
              done(null, false, {'message' : 'invalid domain'})
            }
        }
    ));
};

PassportService.passport = passport;
module.exports = PassportService;
