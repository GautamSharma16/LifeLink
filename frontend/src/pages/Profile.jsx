import {useState,useEffect} from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import '../css/Profile.css'
import api from '../lib/api'
const Profile = () => {
  const [name, setName] = useState()
  
  const [id2, setId2] = useState()
  const [confirmed, setConfirmed] = useState(false)
  const [receiver, setReceiver] = useState([])
  const [acceptedBlood, setAcceptedBlood] = useState([])
 const navigate=useNavigate()
 const userStr = localStorage.getItem('lifelink_user');
 const userObj = userStr ? JSON.parse(userStr) : null;
 const id1 = userObj?._id;
  const getAcceptedBlood=async()=>{
    const {data}= await api.get('/blood?status=accepted');
    const arr=data.data;
    let found = false;
    for(let i=0;i<arr.length;i++){
      if(arr[i].donor && arr[i].donor._id === id1){
        setAcceptedBlood(arr[i]);
        setId2(arr[i].donor._id);
        setConfirmed(arr[i].status === 'completed');
        found = true;
        break;
      }
    }
    if (!found) {
      setAcceptedBlood([]);
      setId2(null);
    }
  }

const getName=async()=>{
    const userStr = localStorage.getItem('lifelink_user');
    const userObj = userStr ? JSON.parse(userStr) : null;
    setName(userObj?.name);
}


const handelLogout=async()=>{
  localStorage.removeItem("lifelink_token");
  localStorage.removeItem("lifelink_user");
  alert('Logout Successful')
  navigate('/login');
}

const handelConfirm=async(pId)=>{
    try {
      const res = await api.patch(`/blood/${pId}/complete`);
     
      if(res.data.success){
        alert("Donation Completed Successfully!");
        window.location.reload();
      }
      else{
        alert(res.data.message)
      }
    } catch (error) {
      console.log(error)
      alert("Something went wrong ")
    }
}

const handelCancel=async(pId)=>{
  alert("Cancellation is not supported in the current system.");
}

 const getHistory=async()=>{
  try {
     const {data}=await api.get(`/blood/history`)
     setReceiver(data.data)
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
           <div className='bName' > <div>Patient Name:</div> <div>{acceptedBlood.patientName}</div>  </div>
           <div className='bName' > <div>Requester</div> <div>{acceptedBlood.requester?.name || "Unknown"}</div>  </div>
           <div className='bMobile' > <div> Units:</div> <div>{acceptedBlood.units}</div> </div>
           <div className='bHospital' > <div>Hospital:</div> <div>{acceptedBlood.hospitalName}</div>  </div>
           <div className='bAddress' ><div>City:</div> <div>{acceptedBlood.city}</div>  </div>
           <button className='confirmBtn' onClick={()=>handelConfirm(acceptedBlood._id)}>Confirm Completed</button>
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
      You Donated To { p.bloodRequest?.patientName } ,&nbsp;&nbsp;&nbsp; Units:{p.unitsDonated}, &nbsp;&nbsp;&nbsp;City :{ p.city} 
      &nbsp;&nbsp;&nbsp; Date: {p.createdAt.split("T")[0]}</div>
    ))}
    </div>:<div className='else'>No History Found</div>}
  </div>
</div>

    </div>
  )
}

export default Profile
