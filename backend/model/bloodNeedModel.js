import mongoose from "mongoose";

const bloodNeedSchema= mongoose.Schema({
      name:{
        type:String,
        required:[true,"Name is required"]
      },
      phone:{
        type:String,
        required:[true,"Phone is required"]
      },
      email:{
        type:String,
        required:[true,"Email is required"]
      },
      hospital:{
        type:String,
        required:[true,"Hospital is required"]
      },
      address:{
        type:String,
        required:[true,"Address is required"]
      },
      bloodGroup:{
        type:String,
        required:[true,"Blood Group is required"],
        enum:['AP','AN','BP','BN','OP','ON','ABP','ABN']
      },
      isAccepted:{
        type:Boolean,
      },
      isConfirmed:{
        type:Boolean,
      },
      acceptedUser:{
        type:mongoose.ObjectId ,
        ref:"users",
      },
      createdBy:{
        type:mongoose.ObjectId ,
        ref:"users",
      }
},{timestamps:true})

export default mongoose.model('bloodNeeds',bloodNeedSchema)