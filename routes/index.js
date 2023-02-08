const express=require('express');
const router=express.Router();
const homeController=require('../controllers/home_controller');

router.get('/',homeController.home);  //Now we will pass every subroute through this index route
router.use('/users',require('./users'));
router.use('/posts',require('./posts'));
router.use('/comments',require('./comments'));
router.use('/accounts',require('./accounts'));
router.use('/likes',require('./likes'));
router.use('/friendship',require('./friendship'));

router.use('/api',require('./api'));

console.log('Router Loaded');
module.exports=router;