const passport=require('passport');
const User=require('../models/user');
const LocalStrategy=require('passport-local').Strategy; //requiring strategy

//authentication using passport
passport.use(new LocalStrategy({
    usernameField:'email',
    passReqToCallback:true
    },
    function(req,email,password,done){                      //done callback is called based on condition with arguments 
        //find a user and establish the identity.
        User.findOne({email:email},(error,user)=>{
            if(error)
            {
                console.log('Error in finding user --> Passport');
                req.flash('error',error);
                return done(error);                            
            }
            if(!user || user.password!=password)
            {
                console.log('Invalid username/password');
                req.flash('error','Invalid username/password ...');
                return done(null,false);                        //null for no error , false for not authenticated
            }

            return done(null,user);                            //null for no error, returning user
        })     
    }
));

//above fn will fetch the user, then user.id will be used in serializer fn to store id in cookie

//lets use serialize and deserialize user fn

//serializing the user to decide which key to be kept in the cookies
passport.serializeUser(function(user,done){
    done(null,user.id);
});

//deserializing the user from the key in the cookies
passport.deserializeUser(function(id,done){
    User.findById(id,(error,user)=>{
        if(error)
            {
                console.log('Error in finding user --> deserialize Passport');
                return done(error);                            
            }
        return done(null,user)
    })
});

//check if user is authenticated
passport.checkAuthentication=function(req,res,next){
    //if user is authenticated, then pass on the request to the next fn(controller's action)
    if(req.isAuthenticated())               //passport provide method is isAuthenticated() to check if user req is authenticated
    {
        return next();     //must return if authenticated
    }
    //if user is not signed in.
    return res.redirect('/users/sign-in');
}

//set the user for sign-in
passport.setAuthenticatedUser=function(req,res,next){
    if(req.isAuthenticated())
    {
        //req.user contains the current signin user from session cookie & we will send it to locals of views
        res.locals.user=req.user;
    }
    return next();
}

module.exports=passport;