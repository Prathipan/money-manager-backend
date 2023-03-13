const mongoose = require("mongoose")

const UserSchema = new mongoose.Schema({
    name : {type : String,required : true},
    email : {type: String,requierd : true,unique : true},
    password : {type: String,required : true},
    cPassword : {type : String, required : true},
    verified : {type : Boolean,default : false}
},{
    timestamps : true
})

module.exports = mongoose.model("User",UserSchema)