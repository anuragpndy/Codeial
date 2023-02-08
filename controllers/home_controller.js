const Post=require('../models/post');
const User=require('../models/user');
const env=require('./../config/environment');

module.exports.home=async (req,res)=>{    
    try{
        let posts=await Post.find({})
        .sort('-createdAt')
        .populate('user')
        .populate({
            path:'comments',
            populate:{
                path:'user likes'
            },
            options: { sort: '-createdAt' }         //showing comments from newest to oldest
        })
        .populate({                 //populating likes for posts
            path:'likes'
        });
        let users=await User.find({});
        
        
        let friends=new Array();
        if(req.user){
            //Populating friends to logged user
            let user=await req.user.populate({path:'friendship',populate:{ path:'from_user to_user' }});    
            for(let f of user.friendship){
                if(req.user.id==f.from_user.id)
                friends.push({userFriendshipId:f.id, userFriend:f.to_user} );
                else if(req.user.id==f.to_user.id)
                friends.push({id:f.id, userFriend:f.from_user});
            }
        }
        return res.render('home',{title : 'Home Page',posts,all_users:users,friends,env});      
    }
    catch(error){
        req.flash('error',error);   
        return console.log('Error',error);
    }      
}