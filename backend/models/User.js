const mongoose= require('mongoose');

const userSchema = new mongoose.Schema({
    firstname:{
        type:String,
        default : null,
        required: true,
    },
    lastname:{
        type:String,
        default : null,
        required: true,
    },
    email:{
        type:String,
        default : null,
        required: true,
        unique: true,
    },
    password:{
        type: String,
        required: true,
    }
    

});

module.exports = mongoose.model("user", userSchema);