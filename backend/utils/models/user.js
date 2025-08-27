import mongoose, { Schema } from "mongoose";

const userSchema = new Schema({
    email : {type : String, required : true,unique : true},
    fullname : {type : String, required : true},
    pass : {type : String, required : true,minlength : 6},
    profilepic : {type : String, default:""},
    bio : {type : String},

},{timestamps:true})


const User = mongoose.model("user" ,userSchema ,)




export default User;