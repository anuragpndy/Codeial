const Post=require('../../../models/post')
const Comment=require('../../../models/comment')
module.exports.index=async function(req,res){
    try{
        const posts=await Post.find({})
                .sort('-createdAt')
                .populate('user')
                .populate({
                    path:'comments',
                    populate:{
                        path:'user'
                    }
                })
    return res.status(200).json({
        message:'List of posts',
        posts:posts
    });
    }
    catch(error){
        console.log(error)
        return res.json(500,{message:'Internal server error'});
    }
}

module.exports.destroy=async (req,res)=>{
    try{
        let post=await Post.findById(req.params.id);
        console.log(req.user);

        //authorization
        if(post.user==req.user.id)
        {   
            post.remove();
            await Comment.deleteMany({post:req.params.id});
            return res.json(200,{message:'post and associated comments deleted successfully'});
        }
        else{
            return res.json(401,{message:'You cant delete this post'});
        }
    }
    catch(error){
        console.log(error)
        return res.json(500,{message:'Internal server error'});
    }    
}
