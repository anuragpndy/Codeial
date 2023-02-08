const Post=require('../models/post');
const Comment=require('../models/comment');
const User = require('../models/user');
const Like = require('../models/like');

module.exports.create=async (req,res)=>{
    try{
        let post=await Post.create({
            content:req.body.content,
            user:req.user._id       //this id is fetched from setAuthenticated fn
        });
        post = await post.populate('user');     //poplating user for showing user name at dynamic created post
        if(req.xhr){    //checking if req is ajax which xhr type request
            
            return res.status(200).json({       //we return with JSON
                data:{
                    post:post
                },
                message:'Post published!',
            });            
        }
        req.flash('success','Post published!');
        return res.redirect('back');
    }
    catch(error){
        req.flash('error',error);
        return console.log('Error',error);
    }
}

module.exports.destroy=async (req,res)=>{
    try{
        let post=await Post.findById(req.params.id);
        //checking that current user can only delelte his posts.
        //id is string conversion of _id ObjectID
        if(post.user==req.user.id)
        {   

            //delete the associted likes to posts and comments 
            await Like.deleteMany({likeable:post,onmodel:'Post'});
            for(a of post.comments){
                let comment=await Comment.findById(a);
                await Like.deleteMany({_id:{$in:comment.likes}});
            }


            post.remove();
            await Comment.deleteMany({post:req.params.id});
            if(req.xhr)
            {
                return res.status(200).json({
                    data:{
                        post_id:req.params.id       //sending post id to xhr json response, which will be used in success prop of ajax fn.
                    },
                    message:'Post and its associated comments deleted!'
                });
            }
            req.flash('success','Post and its associated comments deleted!');
            return res.redirect('back');
        }
        else{
            req.flash('error','You cannot delete this post!');
            return res.redirect('back');
        }
    }
    catch(error){
        req.flash('error',error);
        return console.log('Error',error);
    }
}