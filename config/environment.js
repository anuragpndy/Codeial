const fs=require('fs');
const path=require('path');
const rfs=require('rotating-file-stream');

const logDirectory=path.join(__dirname,'../production_logs');

//lets find if production log directory already exist or create it
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);

const accessLogStream=rfs.createStream('access.log',{
    interval:'1d',
    path:logDirectory
});

const developement={
    name:'developement',
    assets:'./assets',
    session_cookie_key:'blahblah',
    db:'codeial_developement_database',
    smtp:{  //smtp object of nodemailer createTransport
        service:'gmail',
        host:'smtp.gmail.com',
        port:'587',
        secure:false,
        auth:{
            user: process.env.CODEIAL_GMAIL_USERNAME,
            pass:process.env.CODEIAL_GMAIL_PASSWORD
        }
    },
    google_client_id:process.env.CODEIAL_GOOGLE_CLIENT_ID,
    google_client_secret:process.env.CODEIAL_GOOGLE_CLIENT_SECRET,
    google_callbackURL:process.env.CODEIAL_GOOGLE_CALLBACK_URL,
    jwt_secret:'codial',
    morgan:{
        mode:'dev',
        options:{stream:accessLogStream}
    }    
}

const production={
    name:'production',
    assets:process.env.CODEIAL_ASSETS_PATH,
    session_cookie_key:process.env.CODEIAL_SESSION_COOKIE_KEY,
    db:process.env.CODEIAL_DB,
    smtp:{  //smtp object of nodemailer createTransport
        service:'gmail',
        host:'smtp.gmail.com',
        port:'587',
        secure:false,
        auth:{
            user:process.env.CODEIAL_GMAIL_USER,
            pass:process.env.CODEIAL_GMAIL_PASSWORD
        }
    },
    google_client_id:process.env.CODEIAL_GOOGLE_CLIENT_ID,
    google_client_secret:process.env.CODEIAL_GOOGLE_CLIENT_SECRET,
    google_callbackURL:process.env.CODEIAL_GOOGLE_CALLBACK_URL,
    jwt_secret:process.env.CODEIAL_JWT_SECRET,
    morgan:{
        mode:'combined',
        options:{stream:accessLogStream}
    }
}

module.exports =  eval(process.env.NODE_ENV)== undefined ? developement : eval(process.env.CODEIAL_ENVIRONMENT);