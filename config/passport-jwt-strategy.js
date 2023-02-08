const passport=require('passport');
const JWTstrategy=require('passport-jwt').Strategy;
const ExractJWT=require('passport-jwt').ExtractJwt;     //to extract jwt from header
const User=require('../models/user');
const env=require('./environment');

//we encrypt using a key
let opts={
    //here header has list of keys, among those authorization is also a key, this authorization also has a lot of keys, with key bearer. 
    //this bearer will keep token
    jwtFromRequest:ExractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey:env.jwt_secret
}

passport.use(new JWTstrategy(opts,function(jwtPayload,done){
    //Here we will use jwtPayload id to auth user after jwt is create for user
    //in passport-local we used user email & password
    User.findById(jwtPayload._id,(error,user)=>{     
        if(error)
        return console.log('Error finding user from JWT');
        if(user)
        return done(null,user)
        else
        return done(null,false)
    })
}));

module.exports=passport;