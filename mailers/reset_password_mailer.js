const nodemailer = require('../config/nodemailer');
const nodeMailer=require('../config/nodemailer');

module.exports.passResetToken=(token)=>{

    console.log('inside pass reset mailer');

    const htmlString=nodeMailer.renderTemplate({token:token},'/accounts/reset_password.ejs');

    nodeMailer.transporter.sendMail({
        from:'anurag.pndy2016@gmail.com',
        to:token.user.email,
        subject:'codeial password reset',
        html:htmlString
    },function(err,info){
        if(err){
            console.log("error in sending password reset mail : " ,err);
            return;
        }
        console.log("Message Sent !" , info);
        return;
    })
}