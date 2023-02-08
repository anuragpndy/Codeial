const express=require('express');
const router=express.Router();
const profileApi=require('../../../controllers/api/v2/profile_api')
router.get('/',profileApi.index);

module.exports=router;