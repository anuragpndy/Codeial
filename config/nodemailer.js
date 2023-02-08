const nodemailer=require('nodemailer');
const ejs=require('ejs');
const path=require('path');
const env=require('./environment');

//define how communication is going to take place & who is gonna send mail
let transporter=nodemailer.createTransport(env.smtp)

let renderTemplate=(data,relativePath)=>{
    let mailHTML;
    ejs.renderFile(
        path.join(__dirname,'../views/mailers',relativePath),       //here relativePath is place from where this fn is called
        data,
        function(error,template){
            if(error){
                return  console.log('Error in rendering template',error);
            }
            mailHTML=template;  
        }
    )
    return mailHTML;
}



module.exports={
    transporter,renderTemplate
}