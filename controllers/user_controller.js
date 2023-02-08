const User=require('../models/user');
const path=require('path');
const fs=require('fs');
const Friendship=require('../models/friendship');

module.exports.profile=(req,res)=>{
     User.findById(req.params.id,async (error,user)=>{

        //Getting relationship
        let isSender=await Friendship.findOne({from_user:req.user.id,to_user:req.params.id});
        let isReceiver=await Friendship.findOne({from_user:req.params.id,to_user:req.user.id});
        let friend=isSender || isReceiver;
        return res.render('user_profile',
        {
            title:'Profile',
            profile_user:user,
            friend
        });
    });
}

module.exports.update=async (req,res)=>{
    //if current user edit paramed user
    if(req.user.id==req.params.id){
        try{    
            let user=await User.findById(req.params.id);

            //Note- Since form is multipart form, our body parser wont able to parse file. 
            //for file we will use uploadedAvatar fn having req in fn definition.

            User.uploadedAvatar(req,res,function(error){
                if(error) return console.log('**************Multer Error',error);
                if(req.file)    //if file requested to be uploaded
                {
                    let fileExtn=req.file.mimetype;
                    let fileSize=req.file.size;

                    //checking file extension
                    if(fileExtn != 'image/jpeg' && fileExtn !='image/gif' && fileExtn != 'image/jpg' && fileExtn != 'image/png' && fileExtn != 'image/bmp' && fileExtn != 'image/tiff' )
                    {
                        req.flash('error','File type should be jpeg, gif, png, jpg, bmp or tiff !');
                        return res.redirect('back');
                    }

                    //checking file size greater than 60mb
                    if(fileSize > 62914560)
                    {
                        req.flash('error','File size can not be more than 60mb !');
                        return res.redirect('back');
                    }

                    if(user.avatar && fs.existsSync(path.join(__dirname,'..',user.avatar  )))
                    {
                        fs.unlinkSync(path.join(__dirname,'..',user.avatar  ))  //traversing from user controller to parent, upload, user, avatar, avatar file
                    }
                    //avatar path
                    user.avatar=User.avatarPath+'/'+req.file.filename
                }
                user.name=req.body.name;
                user.email=req.body.email;
                user.save();
                console.log(req.body);
                return res.redirect('back');
            });
        }
        catch(error){
            req.flash('error',error.ResponseText);
            return res.redirect('back');
        }
    }
    else{
        req.flash('error','Unauthorized!');
        return res.status(401).send('Unauthorized');
    }
}

//render the sign up page
module.exports.signUp=(req,res)=>{
    if(req.isAuthenticated()){
        return res.redirect('/users/profile');
    }
    return res.render('user_sign_up',{
        title:'Codial | Sign Up'
    });   
}

//render the sign in page
module.exports.signIn=(req,res)=>{
    if(req.isAuthenticated()){
        return res.redirect('/users/profile');
    }
    return res.render('user_sign_in',
    {
        title:'Codial | Sign In'
    });
}

//get the signup data
module.exports.create=async (req,res)=>{
    try{
        if(req.body.password!=req.body.confirm_password){    //if password does not match
            req.flash('error','Passwords do not match');
            console.log('Passwords do not match');
            return res.redirect('back');
        }
        let user=await User.findOne({email:req.body.email});
        if(!user){       //if we did not find existing user with this email
            let newUser=await User.create(req.body);
            if(newUser){
                req.flash('success','Successfully SignedUp!');
                console.log(`Created user : ${newUser}`);
                return res.redirect('/users/sign-in');
            }
            req.flash('error','Could not signup!');
            console.log(`Could not signup!`);
            return res.redirect('back');
            }
        else{
            req.flash('error','User already exist');
            console.log('User already exist');
            return res.redirect('back');    //if user already exist
        }
    }
    catch(error){
        req.flash('error',error);
        return console.log('Error',error);
    }
}

//sign in and create session for the user
module.exports.createSession=(req,res)=>{
    req.flash('success','Logged In Successfully.');
    return res.redirect('/');
}

//destroy session
module.exports.destroySession=(req,res)=>{
    req.flash('success','Logged Out Successfully.');
    req.logout();       //fn provided by passport
    return res.redirect('/');
}