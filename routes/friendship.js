const express=require('express');
const router=express.Router();
const friendshipController=require('../controllers/friendship_controller');

router.post('/toggle',friendshipController.toggleFriendship);
router.get('/delete',friendshipController.deleteFriendship);

module.exports=router;