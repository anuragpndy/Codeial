const Like=require('../models/like');
const Comment=require('../models/comment');
const Post=require('../models/post');

module.exports.toggleLike=async (req,res)=>{
    try{
        //first we take out likeable
        let likeable;
        let deleted=false;      
        //this will toggle likes, when deleted is false then like++ and when deleted is true then like--;
        //deleted:false will increase like if we havenot liked it, when we like, make deleted:true.
        
        if(req.query.type=='Post'){
            likeable=await Post.findById(req.query.id).populate('likes');   //populate the likes
        }
        else{
            likeable=await Comment.findById(req.query.id).populate('likes');   //populate the likes
        }

        //find that like already exist
        let existingLike=await Like.findOne({
            likeable:req.query.id,
            onmodel:req.query.type,
            user:req.user._id
        });
        //if like already exist then delete it
        if(existingLike){
            likeable.likes.pull(existingLike._id);
            likeable.save();
            existingLike.remove();
            deleted=true;
        }
        else{       //make a new like
            let newLike=await Like.create(
                {
                    user:req.user._id,
                    likeable:req.query.id,
                    onmodel:req.query.type
                });
            likeable.likes.push(newLike._id);
            likeable.save();
        }
        return res.status(200).json({message:'Request Successful!',data:{
            deleted:deleted
        }});
    }
    catch(e){
        console.log(e);
        return res.status(500).json({message:'Internal server error'});
    }
}

