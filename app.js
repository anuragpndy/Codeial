const express=require('express');
const PORT=8000;
const app=express();
//passing express app instance through view helpers fn
require('./config/view-helpers')(app);
const path=require('path');
const expressLayouts=require('express-ejs-layouts');
const db=require('./config/mongoose');
const cookieParser=require('cookie-parser');
//used for session cookie
const session=require('express-session');
const passport=require('passport'); 
const passportLocal=require('./config/passport-local-strategy');
const passportJWT=require('./config/passport-jwt-strategy');
const passportGoogle=require('./config/passport-google-oauth2-strategy');
const MongoStore=require('connect-mongo');
const flash=require('connect-flash');
const customMiddleware=require('./config/middleware');
const env=require('./config/environment');
const logger=require('morgan');

//setup the chat server to be used with socket.io
const chatServer=require('http').Server(app);
const chatSockets=require('./config/chat_sockets').chatSockets(chatServer);
chatServer.listen(5000);    
console.log(`Chat Server started listening on port 5000`);

app.use(express.urlencoded({extended:true}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname,env.assets)));
app.use(logger(env.morgan.mode,env.morgan.options));    

app.use('/uploads',express.static(path.join(__dirname, '/uploads')))
//means giving /uploads folder for /uploads route(1st arg)

//setup view engine
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'./views'));
app.use(expressLayouts);
app.set('layout extractStyles',true);
app.set('layout extractScripts',true);



//using express session to encrypt to cookie
app.use(session({
    name:'codeial',
    //Todo change the secret before deployement
    secret:env.session_cookie_key,
    saveUninitialized:false,        //when user is not logged in, identity is not made, session is not created , should we store extra info in it : false 
    resave:false,                   //when session has user data like id & other info, should we resave of even there is no change.
    cookie:{
        maxAge:(100*60*6*100)   //100*60*6*100 = 60 minutes
    },
    store:MongoStore.create({
        mongoUrl:'mongodb://localhost/codeial_developement_database',
        autoRemove:'disabled'        //Disable expired sessions cleaning
    },(error)=>console.log(error || 'connect-mongodb setup'))
}));

app.use(passport.initialize());     //telling the app to use passport and 
app.use(passport.session());        //passport also help in maintaing sessions of deserizing
app.use(flash());
app.use(customMiddleware.setFlash);

//when any req is made, this middleware will be called, locals will be set to user
app.use(passport.setAuthenticatedUser); //now when passport is initailized only then this fn will be initialized

//Using router, to use router file we use app.use middleware
app.use('/',require('./routes/index'));         //use it after passport initialize

app.listen(PORT,(error)=>{
    if(error)
    console.log(error);
    console.log(`Server started listening on port ${PORT}`);
});