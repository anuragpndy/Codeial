const env=require('./environment');
const fs=require('fs');
const path=require('path');

module.exports=(app)=>{     //receiveing express app
    app.locals.assetPath=function(filePath){
        if(env.name=='developement'){
            //console.log(filePath)
            return '/'+ filePath;
        }
        //console.log(filePath)
        //console.log('/'+JSON.parse(fs.readFileSync(path.join(__dirname, '../public/assets/rev-manifest.json')))[filePath]);
        return '/'+ JSON.parse(fs.readFileSync(path.join(__dirname,'../public/assets/rev-manifest.json')))[filePath];
    }   //removed '/' or './' from all asset path, will give '/' from here
}