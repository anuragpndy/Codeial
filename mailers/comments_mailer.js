const nodemailer=require('../config/nodemailer');
//this is another way of exporting method
exports.newComments=(comment)=>{
    console.log('Inside new comment mailer',comment);
    let htmlString=nodemailer.renderTemplate({comment},'/comments/new_comment.ejs')

    nodemailer.transporter.sendMail({
        from:'anurag.pndy2016@gmail.com',   //nodemailer wont use it to send mail, it wud be which we defined in config
        to:comment.user.email,
        subject:'New Comment Published.',
        html:htmlString
    },(error,info)=>{
        if (error) return console.log(error);
        console.log('Mail sent',info);  //info is ino message req.
    })
}

