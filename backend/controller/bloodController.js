import bloodNeedModel from "../model/bloodNeedModel.js"

export const bloodNeedController=async(req,res)=>{
      try {
        const {name,phone,bloodGroup,hospital,email,address,createdBy,isAccepted,acceptedUser,isConfirmed}=req.body
         if(!name || !phone || !bloodGroup || !hospital || !address || !email){
            return res.status(400).send({
                success:false,
                message:"All fields are Required"
            })
         }  
        const existingNeed=await bloodNeedModel.findOne({email})
        if(existingNeed){
            return res.status(200).send({
                success:false,
                message:"User can give Only one blood need at a time with a email"
            })
        }
        
         const bloodNeed= await new bloodNeedModel(req.body).save()
         
         res.status(201).send({
            success:true,
            message:"Blood Need Added",
            bloodNeed
         })
      } catch (error) {
        console.log(error)
        res.status(400).send({
            success:true,
            message:"Something Went wrong in blood need",
            error
        })
      }
}


export const getBloodNeedController=async(req,res)=>{

   try {
    const {bloodGroup,address}=req.query ;
    const filter={}
    if( bloodGroup) filter.bloodGroup=bloodGroup;  
    if( address) filter.address=address;


    const bloodNeeds= await bloodNeedModel.find(filter)
    res.status(200).send({
        success:true,
        message:" All Blood needs are fetched",
        bloodNeeds
    })
   } catch (error) {
    console.log(error)
    res.status(400).send({
        success:true,
        message:"Something Went wrong in blood need",
        error
    })
   }   
}
export const getSingleBloodController=async(req,res)=>{
    try {
        const {id}=req.params
        const bloodNeed= await bloodNeedModel.findById(id)
        if(!bloodNeed){
            res.status(200).send({
                success:false,
                message:"Blood need not found"
            })
        }
        res.status(200).send({
            success:true,
            message:" Blood need is fetched",
            bloodNeed
        })
       } catch (error) {
        console.log(error)
        res.status(400).send({
            success:true,
            message:"Something Went wrong in blood need",
            error
        })
       } 
}


export const deleteBloodNeedController=async(req,res)=>{
    try {
        const {id}=req.params
    
        await bloodNeedModel.findByIdAndDelete(id)
        res.status(200).send({
            success:true,
            message:"Blood Need Deleted "
        })
    } catch (error) {
        console.log(error)
        res.status(400).send({
            success:true,
            message:"Something Went wrong in blood need",
            error
        })
    }
}


export const needAcceptedController=async(req,res)=>{
     try {
        const {id}=req.params
        const {isAccepted,acceptedUser}=req.body

        const check=await bloodNeedModel.find({isAccepted:true,acceptedUser})
        if(check.length >=1){
            return res.status(200).send({
            success:false,
            message:"Already accepted one Blood Donation"
           })
        }

        const updatedNeed=await bloodNeedModel.findByIdAndUpdate(id,{...req.body})

        await updatedNeed.save();
        res.status(200).send({
            success:true,
            message:"Need Accepted Successfully",
            updatedNeed
        })

     } catch (error) {
        console.log(error)
        res.status(400).send({
            success:true,
            message:"Something Went wrong in accepting",
            error
        })
     }
}

 export const needConfirmedController=async(req,res)=>{
     try {
        const {id}=req.params

           const updatedNeed=await bloodNeedModel.findByIdAndUpdate(id,{isConfirmed:true})   
           await updatedNeed.save();
           console.log(updatedNeed)
           res.status(200).send({
            success:true,
            message:"Donation Confirmed",
            updatedNeed
           })  
     } catch (error) {
        console.log(error)
        res.status(400).send({
            success:true,
            message:"Something Went wrong in confirmation",
            error
        })
     }
}