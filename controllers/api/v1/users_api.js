const User=require('../../../models/user');
const jwt=require('jsonwebtoken');
const env=require('../../../config/environment');

module.exports.createSession=async(req,res)=>{
    try{
        let user=await User.findOne({email:req.body.email});
        console.log(user);
        if(!user || user.password!=req.body.password)
        return res.status(422).json({
            message:'Invalid username/password'
        });
        return res.status(200).json({
            message:'Sign in successful, here is youe token, plz keep it safe.',
            token:jwt.sign(user.toJSON(),env.jwt_secret,{expiresIn:'100000'})       //using env vars
        });
    }
    catch(e){
        console.log(e);
        res.status(422).json({
            message:'Internal server error'
        })
    }

}