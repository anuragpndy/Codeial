const express=require('express');
const router=express.Router();
const userController=require('../controllers/user_controller');
const passport=require('passport'); 

router.get('/profile/:id',passport.checkAuthentication,userController.profile);// 
router.post('/update/:id',passport.checkAuthentication,userController.update);

router.get('/sign-in',userController.signIn);
router.get('/sign-up',userController.signUp);
router.get('/sign-out',userController.destroySession);

router.post('/create',userController.create);

//use passport as a middleware to auth
router.post('/create-session',passport.authenticate(
    'local',{failureRedirect:'/users/sign-in'}
),userController.createSession);

router.get('/auth/google',passport.authenticate('google',{scope:['profile','email']})); //here scope is info which we wanna get from google
router.get('/auth/google/callback',passport.authenticate('google',{failureRedirect:'/users/sign-in'}),userController.createSession);

module.exports=router; 