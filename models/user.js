const mongoose=require('mongoose');
const multer=require('multer');
const path=require('path');
const AVATAR_PATH=path.join('/uploads/users/avatars')

const userSchema=new mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    name:{
        type:String,
        required:true
    },
    avatar:{
        type:String,
        default:'https://cdn.pixabay.com/photo/2012/04/26/19/43/profile-42914_960_720.png'      //given default avatar
    },
    friendship:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'Friendship'
        }
    ]

},{timestamps:true});

let storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join(__dirname,'..',AVATAR_PATH))
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now());
    }
});

//Using static methods -
//Tip- Schema Statics are methods that can be invoked directly by a Model (similar to oops static method)
//static in oops- static method called upon whole class, not its instances.
//ex- there is class planets , if we need to count population of all planets, 
//    then we call static method on whole planet class, not object of planet class. 

userSchema.statics.uploadedAvatar=multer({storage:storage}).single('avatar');
//here single says only one file will be uploaded to avatar field
userSchema.statics.avatarPath=AVATAR_PATH;
//now AVATAR_PATH will be publically available to user, so in controller we can access and save file in AVATAR_PATH

const User=mongoose.model('User',userSchema);
module.exports=User;