const express=require('express');
const router=express.Router();
const commentsController=require('../controllers/comments_controllers');
const passport=require('passport');

router.post('/create',passport.checkAuthentication,commentsController.create);
router.get('/destroy/:id/:post',passport.checkAuthentication,commentsController.destroy);

module.exports=router;