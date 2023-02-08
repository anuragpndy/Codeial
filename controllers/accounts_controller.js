const User = require('../models/user');
const crypto = require('crypto'); //pre isntalled in node now 
const ResetPassToken = require('../models/reset_pass_token');
const resetPassMailer = require('../mailers/reset_password_mailer');
const queue=require('../config/kue');
const resetPassWorker=require('../workers/reset_password_email_worker');

module.exports.forgotPass=function(req,res){

    return res.render('forgot_pass',{
        title:"Forgot Password",
        heading:"forgot Password"
    })
}


module.exports.verifyEmail=async function(req,res){
    const userEmail=req.body.email;
    try{
        let user=await User.findOne({email:userEmail});
        if(user){
            const accessToken=crypto.randomBytes(20).toString('hex');

            let token=await ResetPassToken.create({
                user:user._id,
                accessToken:accessToken,
                isValid:true
            });
            token=await token.populate('user','name email');

            let job=queue.create('resetPasswordEmail',token).priority('medium').save(function(err){
                if(err){
                    console.log("error in sending reset pass mail to queue "  ,err);
                    return;
                }
                console.log('job enqueued',job.id);
            });

            //resetPassMailer.passResetToken(token);

            req.flash('success','Password reset link sent to email provided!!');
            return res.redirect('back');
        }else{
            req.flash('error' , 'Invalid User !');
            return res.redirect('back');
        }
    }catch(error){
        req.flash('error' , error);
        console.log(error);
        return res.redirect('back');
    }
}

module.exports.resetPass=async function(req,res){

    try{
    let token=req.query.accessToken;
    let finalToken=await ResetPassToken.findOne({accessToken:token});
    if(finalToken && finalToken.isValid){
        return res.render('reset_pass',{
            title:"RESET PASSWORD",
            heading:"RESET PASSWORD",
            accessToken:token
        });
    }else{
        req.flash('error' , "Unauthorized !");
        return res.redirect('back');
    }
    }
    catch(err){
        console.log('error in reset pass page load',err);
        return res.redirect('back');
    }
}


module.exports.resetPassFinal=async function(req,res){
    if(req.body.password!=req.body.confirmPassword){
        req.flash('error','password does not match');
        return res.redirect('back');
    }

    try{
        let token=req.body.accessToken;
        let finalToken=await ResetPassToken.findOne({accessToken:token});
    if(finalToken && finalToken.isValid){
        let user=await User.findById(finalToken.user);
        user.password=req.body.password;
        await user.save();
        finalToken.remove();
        req.flash('success','password reset successfully');
        return res.redirect('/users/sign-in');
    }else{
        req.flash('error' , "Unauthorized !");
        return res.redirect('back');
    }


    }catch(err){
        req.flash('error' ,"error in resetting password");
        console.log("error in resetting password", err)
           return res.redirect('back');
    }
    

}