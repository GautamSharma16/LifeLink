import mongoose from "mongoose";

const historySchema=mongoose.Schema({
 donarId:{
    type:mongoose.ObjectId ,
    ref:"users",
    required:true
 },
 receiverId:{
    type:mongoose.ObjectId ,
    ref:"bloodNeeds",
    required:true
 }
},{timestamps:true})


export default mongoose.model('history',historySchema)