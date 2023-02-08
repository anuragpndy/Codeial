const Comment=require('../models/comment');
const Post=require('../models/post');
const commentsMailer=require('../mailers/comments_mailer');
const queue = require('../config/kue');
const commentEmailWorker = require('../workers/comment_email_worker');
const Like=require('../models/like');

module.exports.create=async (req,res)=>{
    try{
        //someone can fiddle with db, can create custom post form, will comment with his own post id,
        //to resolve we check that this post id exist or not.
        let post=await Post.findById(req.body.post);
        if(post)
        {
            let comment=await Comment.create({
                content:req.body.content,
                post:req.body.post,
                user:req.user._id,
            });
            post.comments.push(comment);    //pushing comment to array, it will automatically find id of post and push to it.
            //after pushing or updating we need to call save, so db save the changes. Before save() it was in RAM.
            post.save();

            comment = await comment.populate('user');     //poplating user for showing user name at dynamic created comment 
            commentsMailer.newComments(comment);            //sending mail
            if (req.xhr){
                // Similar for comments to fetch the user's id!
                // for (a of comment)
                // console.log(a.user.name);
                return res.status(200).json({
                    data: {
                        comment: comment,
                        post:post
                    },
                    message: "Comment published!"
                });
            }

            req.flash('success','Comment published!');  
            return res.redirect('/');
        }
    }
    catch(error){
        req.flash('error',error);
        return console.log('Error',error);
    }
}

module.exports.destroy=async (req,res)=>{
    try{
        let post=await Post.findById(req.params.post);
        let comment=await Comment.findById(req.params.id);
        //checking that comment owner or post owner can delete the comment     
        if(comment.user==req.user.id || post.user==req.user.id){

            //deleting the likes of comment
            await Like.deleteMany({likeable:comment._id,onmodel:'Comment'});

            comment.remove(); 
            //We also have to delete comment from post comments array too
            //So we have to pull comment from comments array in Post, so we will use findByIdAndUpdate.
            let post=await Post.findByIdAndUpdate(req.params.post,{ $pull:{comments:req.params.id }});
            //With findByIdAndUpdate , we dont have to call save()

            // send the comment id which was deleted back to the views
            if (req.xhr){
                return res.status(200).json({
                    data: {
                        comment_id: req.params.id
                    },
                    message: "Comment deleted!"
                });
            }

            req.flash('success','Comment deleted!');
            return res.redirect('back');
        }
        else{
            req.flash('error','You cannot delete this comment!');
            return res.redirect('back');
        }
    }
    catch(error){
        req.flash('error',error);
        return console.log('Error',error);
    } 
}