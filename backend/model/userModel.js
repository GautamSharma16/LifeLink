import mongoose from "mongoose";

const userSchema= mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    phone:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
     },
    address:{
        type:String,
        required:true
     },
     bloodGroup:{
        type:String,
        required:[true,"Blood Group is required"],
        enum:['AP','AN','BP','BN','OP','ON','ABP','ABN']
     }
},{timestamps:true})

export default mongoose.model('users',userSchema)