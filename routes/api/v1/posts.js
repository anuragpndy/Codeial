const express=require('express');
const router=express.Router();

const postApi=require('../../../controllers/api/v1/posts_api');
const passport=require('passport');


router.get('/',postApi.index);

//authenticating
router.delete('/:id',passport.authenticate('jwt',{session:false}),postApi.destroy); //we dont wanna generate session cookie

module.exports=router;