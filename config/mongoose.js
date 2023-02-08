const mongoose=require('mongoose');
const env=require('./environment');

mongoose.connect(`mongodb://localhost/${env.db}`);

const db=mongoose.connection;

db.on('error',console.error.bind(console,'Error connecting database ...'));

db.once('open',()=>console.log(`Connected to mongodb database :: ${db.name}`));

module.exports=db;