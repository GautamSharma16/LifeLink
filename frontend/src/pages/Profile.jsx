import {useState,useEffect} from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import '../css/Profile.css'
import axios from 'axios'
const Profile = () => {
  const [name, setName] = useState()
  
  const [id2, setId2] = useState()
  const [confirmed, setConfirmed] = useState(false)
  const [receiver, setReceiver] = useState([])
  const [acceptedBlood, setAcceptedBlood] = useState([])
 const navigate=useNavigate()
 var user = JSON.parse(localStorage.getItem('token'));
 const id1=user.existingUser._id
  const getAcceptedBlood=async()=>{
    const {data}= await axios.get('http://localhost:8080/api/v1/blood/get-blood-needs');
    // console.log(data.bloodNeeds)

   
    const arr=data.bloodNeeds
    
    for(let i=0;i<arr.length;i++){
      if(arr[i].isAccepted == true && arr[i].acceptedUser== id1){
        setAcceptedBlood(arr[i]);
        setId2(arr[i].acceptedUser)
        setConfirmed(arr[i].isConfirmed)
      }
    }
  }

const getName=async()=>{
    var user = JSON.parse(localStorage.getItem('token'));
  setName(user.existingUser.name)
}


const handelLogout=async()=>{
  localStorage.removeItem("token");
  alert('Logout Successful')
  navigate('/login');
}

const handelConfirm=async(pId)=>{
    try {
      let a=prompt("Enter the OTP to confirmed")
      if(!a){
        alert("OTP not found")
      }
      const res  = await axios.put(`http://localhost:8080/api/v1/blood/update-confirmed/${pId}`,{isConfirmed:true});
     
      if(res.data.success){
        alert(res.data.message)
        // navigate('/profile')
      }
      else{
        alert(res.data.message)
      }
      
      const payload2={isAccepted:false,acceptedUser:null}
       await axios.put(`http://localhost:8080/api/v1/blood/update-accepted/${pId}`,payload2);


       const email=acceptedBlood.email
       const payload1={mailTo:email,sendText:"Congrats your blood need has been confirmed it will be sent to you shortly "}
       await axios.post(`http://localhost:8080/api/v1/mail/send-mail`,payload1)
    
      
      

        const payload={donarId:id1,receiverId:pId}
        console.log(payload)
        const {data}= await axios.post(`http://localhost:8080/api/v1/history/create-history`,payload)
        if(data.success){
          alert(data.message)
        }
        else{
          alert(data.message)
        }

       window.location.reload();


    } catch (error) {
      console.log(error)
      alert("Something went wrong ")
    }
}
const handelCancel=async(pId)=>{
  try {
    const payload={isAccepted:false,acceptedUser:null}
        const { data } = await axios.put(`http://localhost:8080/api/v1/blood/update-accepted/${pId}`,payload);

        if(data.success){
          alert('Donation Canceled')
          navigate('/donate-blood')
        }
        else{
          alert('Cancel Failed')
        }
  } catch (error) {
    console.log(error)
    alert('Something Went Wrong in Canceling')
  }
}

 const getHistory=async()=>{
  try {
     const {data}=await axios.get(`http://localhost:8080/api/v1/history/get-history?donarId=${id1}`)
     
     setReceiver(data.history)
     
  } catch (error) {
    console.log(error)
    alert('Something Went Wrong in Showing History')
  }
 }

 const blood=(bloodG)=>{
  let b=''
      switch(bloodG){
        case 'AP':
            b= 'A+';
            break;
        case 'AN':
            b= 'A-';
            break;
        case 'BP':
            b= 'B+';
            break;
        case 'BN':
            b= 'B-';
            break;
        case 'ABP':
            b= 'AB+';
            break;
        case 'ABN':
            b= 'AB-';
            break;
        case 'OP':
            b= 'O+';
            break;
        case 'ON':
            b= 'O-';
            break;
      }
      return b;
}

 
useEffect(()=>{
  getName();
  getAcceptedBlood();
  getHistory()
},[])

  return (
    <div>
        <Navbar/>
        <div className="profileFirst"> <div>Hello, {name}</div> <div><button className="logout" onClick={handelLogout}>Logout</button></div>  </div>
        <hr />
        <div className="heading">Thanks for Accepting the Blood Need</div>
        <div className="pending">

        {id1 && id2 && confirmed===false ? 
       
          <div className="box2">
          <div className="bloodCard2"> 
           <div className='bGroup' > <div> BloodGroup:</div>  <div> {acceptedBlood.bloodGroup} </div> </div>
           <div className='bName' > <div>Name:</div> <div>{acceptedBlood.name}</div>  </div>
           <div className='bName' > <div>Email</div> <div>{acceptedBlood.email}</div>  </div>
           <div className='bMobile' > <div> Mobile No.:</div> <div>{acceptedBlood.phone}</div> </div>
           <div className='bHospital' > <div>Hospital:</div> <div>{acceptedBlood.hospital}</div>  </div>
           <div className='bAddress' ><div>Address:</div> <div>{acceptedBlood.address}</div>  </div>
           <button className='confirmBtn' onClick={()=>handelConfirm(acceptedBlood._id)}>Confirm</button>
           <button className='cancelBtn' onClick={()=>handelCancel(acceptedBlood._id)}>Cancel</button>
           </div>
        </div> : <div className='else'> No Need Accepted</div>}
        </div>

        <hr />
        <div className="History">
  <div className="heading">Your Previous Donation</div>
  <div className="historyBox">
  
    {id1  ? 
    <div className="map">

    {receiver.map((p,index) => (
      <div className='history' key={index}>
      You Donated To { p.receiverId.name } ,&nbsp;&nbsp;&nbsp; Phone:{p.receiverId.phone}, &nbsp;&nbsp;&nbsp;BloodGroup :{ blood(p.receiverId.bloodGroup)} 
      &nbsp;&nbsp;&nbsp; Date: {p.createdAt.split("T")[0]}</div>
    ))}
    </div>:<div className='else'>No History Found</div>}
  </div>
</div>

    </div>
  )
}

export default Profile
