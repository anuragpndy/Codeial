const Friendship=require('../models/friendship');
const User = require('../models/user');

module.exports.toggleFriendship=async function(req,res){
    try{
        let added=false;
        let isSender=await Friendship.findOne({from_user:req.user.id,to_user:req.query.id});
        let isReceiver=await Friendship.findOne({from_user:req.query.id,to_user:req.user.id});
        //console.log(isSender,'\n',isReceiver,'\n');

        let frnd=isSender || isReceiver;
        if(frnd){
            let user1=await User.findById(req.query.id);
            user1.friendship.pull(frnd._id);
            user1.save();
            console.log('frnd',frnd);
            req.user.friendship.pull(frnd._id);
            req.user.save();
            frnd.remove();
        }
        else{
            let friend=await Friendship.create({from_user:req.user.id,to_user:req.query.id});
            req.user.friendship.push(friend._id);
            let reciever=await User.findById(req.query.id);
            reciever.friendship.push(friend._id);
            req.user.save();
            reciever.save();
            console.log('Sender',req.user.friendship);
            console.log('Receiver',reciever.friendship);
            console.log('Made Friendship');
            added=true;
        }
        if(req.xhr){
            return res.status(200).json({message:'Request Successful!',data:{
                added,
                id:req.query.id
            }});
        }
        return res.redirect('back');
    }
    catch(e){
        console.log(e);
        return res.status(500).json({message:'Internal server error'});
    }
}

module.exports.deleteFriendship=async (req,res)=>{
    try{
        let isSender=await Friendship.findOne({from_user:req.user.id,to_user:req.query.id});
        let isReceiver=await Friendship.findOne({from_user:req.query.id,to_user:req.user.id});
        let frnd=isSender || isReceiver;
        if(frnd){
            let user1=await User.findById(req.query.id);
            user1.friendship.pull(frnd._id);
            user1.save();
            console.log('frnd',frnd);
            req.user.friendship.pull(frnd._id);
            req.user.save();
            frnd.remove();   
        }
        return res.redirect('back');
    }
    catch(e){
        console.log(e);
        return res.status(500).json({message:'Internal server error'});
    }    
}