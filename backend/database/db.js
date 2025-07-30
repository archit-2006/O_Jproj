const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const DBConnection = async ()=>{
    const MONGO_URI = process.env.MONGODB_URL;

try{
    await mongoose.connect(MONGO_URI);
    console.log("DB connection established");
}
catch(error){
    console.log("Error while connection to MongoDB",error);
}
};

module.exports={ DBConnection };