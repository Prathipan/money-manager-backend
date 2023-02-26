const mongoose = require("mongoose");
const ObjectID = mongoose.Schema.Types.ObjectId;

const TransactionSchema = new mongoose.Schema({
    userId : {type : ObjectID,required : true,ref : "User"},
    name : {type : String, required : true},
    amount : {type : Number,required : true},
    type : {type : String, required :true}
},{timestamps:true})

module.exports = mongoose.model("Transaction",TransactionSchema);