var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const _ = require('lodash')

var config = require('../../Config');

var PassportService = function(){};

PassportService.Init = function(app){

    passport.use(new GoogleStrategy({
          clientID : config.google.google_client_id,
          clientSecret : config.google.google_client_password,
          callbackURL : "/auth/google/callback"
        },
        function(accessToken, refreshToken, profile, done) {

            /* TODO 1. User.findAndCreate */
            /* TODO 2. Session Managing */

            console.log('### in passport service')
            if(profile._json.domain) {
              accessToken = ''
              refreshToken = ''
              return done(null, profile);
            } else {
              accessToken = ''
              refreshToken = ''
              profile._json.domain = 'other.domain'
              done(null, profile)
            }
            console.log('### out passport service')
            // console.log(profile.user._json.domain);


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
