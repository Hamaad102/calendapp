const passport = require('passport')
const GoogleStrategy = require( 'passport-google-oauth2' ).Strategy;

// Model
const User = require("../models/User");

passport.serializeUser((user, done) => {
    done(null, user)
})

passport.deserializeUser((id, done) => {
    User.findById(id).then(user => {
        done(null, user)
    })
})

passport.use(new GoogleStrategy({
    clientID:     process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: "/auth/google/redirect",
    passReqToCallback   : true
  }, (req, accessToken, refreshToken, profile, done) => {
      // Add Access Token to session
      req.session.accessToken = accessToken
      User.findOne({ serviceid: profile.id }).then((currentUser) => {
        if (currentUser) {
            done(null, currentUser)
        } else {
            new User({
                username: profile.displayName,
                email: profile._json.email,
                refreshToken: refreshToken,
                picture: profile._json.picture,
                serviceid: profile.id,
                strategy: 'google',
            }).save().then((newUser) => {
                done(null, newUser)
            })
        }
        });
    }
));