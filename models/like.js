const mongoose=require('mongoose');

const likeSchema=new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
    },
    //this define the obj id of the likeable obj(post or comment)
    likeable:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        refPath:'onmodel'       //now a likeable can be post or comment due to this.
    },
    //this field is used to define the likeable obj since this is a dynamic refernce
    onmodel:{
        type:String,
        required:true,
        enum:['Post','Comment']         //here enum define likeable can be only Post or Comment, if we dont use enum, likeable will be any type.
    }
},{timestamps:true});

const Like=mongoose.model('Like',likeSchema);

module.exports=Like;