const passport=require('passport');
const googleStrategy=require('passport-google-oauth').OAuth2Strategy;
const crypto=require('crypto');
const User=require('../models/user');
const env=require('./environment');
const { google_client_secret, google_callbackURL } = require('./environment');


//tell passport to use new strategy for google login
passport.use(new googleStrategy({
        clientID:env.google_client_id,
        clientSecret:env.google_client_secret,
        callbackURL:env.google_callbackURL
    },function(accessToken,refreshToken,profile,done){
        //accesstoken- it is same as we were generating and using it in JWT, sending it in header
        //refreshtoken- if accesstoken expires then use it to get new accesstoken
        User.findOne({email:profile.emails[0].value}).exec( //here profile has email select by user, when clicked signin using google
            function(error,user){
                if(error)
                return  console.log('Error in google strategy passport',error);
                console.log(profile);
                console.log(accessToken,refreshToken);
                if(user)
                    //if found set user as req.user means signin the user
                    return done(null,user)
                else{   //if user does not exist then signup
                    User.create({
                        email:profile.emails[0].value,
                        name:profile.displayName,
                        password:crypto.randomBytes(20).toString('hex')
                    },function(error,user){
                        if(error)
                            return  console.log('Error in google strategy passport',error);
                        return done(null,user)
                                });
                }
            }
        );
    }
    
));