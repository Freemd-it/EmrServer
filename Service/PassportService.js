var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth2').Strategy;

var config = require('../Common/Config.js');

var PassportService = function(){};

PassportService.Init = function(app){

    passport.use(new GoogleStrategy({
          clientID : config.googleConfig.google_client_id,
          clientSecret : config.googleConfig.google_client_password,
          callbackURL : "http://localhost/auth/google/callback",
          passReqToCallback : true
        },
        function(accessToken, refreshToken, profile, done) {

            return done;
        }
    ));

    passport.serializeUser(function(user, done) {

        done(null, user);
    });

    passport.deserializeUser(function(obj, done) {

        done(null, obj);
    });
}

PassportService.ExtractProfile = function(profile){

    let imageUrl = '';

    if(profile.photos && profile.photos.length){
        imageUrl = profile.photos[0].value;
    }
    return{
        id : profile.id,
        displayName : profile.displayName,
        image : imageUrl
    }
}

PassportService.passport = passport;

module.exports = PassportService;
