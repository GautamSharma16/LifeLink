import {useState,useEffect} from 'react'
import Navbar from '../components/Navbar'
import api from '../lib/api'
import { useNavigate } from 'react-router-dom'
import '../css/DonateBlood.css'
const DonateBlood = () => {
  const navigate=useNavigate()
  const [bloodData, setBloodData] = useState([])
  const [address, setAddress] = useState()
  const [bloodGroup, setBloodGroup] = useState()
  const [createdBy, setCreatedBy] = useState()
  
  const getBloodNeeds=async()=>{
    let query = "?status=open";
    if (bloodGroup) query += `&bloodGroup=${bloodGroup}`;
    if (address) query += `&city=${address}`; // using address input for city

    const { data } = await api.get(`/blood${query}`);
    if(data.data.length === 0){
      alert('No Data Found regarding this filter')
      window.location.reload()
    }
    setBloodData(data.data);
  }


  
  const userStr = localStorage.getItem('lifelink_user');
  const user = userStr ? JSON.parse(userStr) : null;
  const id = user?._id;

  const handelAccept=async(pId)=>{
    if (!id) {
      alert("Please login first");
      navigate('/login');
      return;
    }
    try {
      const { data } = await api.patch(`/blood/${pId}/accept`);
      if(data.success){
        alert("Blood need accepted successfully!");
        navigate('/profile')
      }
      else{
        alert(data.message || "Failed to accept")
      }
    } catch (error) {
      console.log(error)
      alert(error.response?.data?.message || "Something went wrong")
    }
  }
const removeFilter=()=>{
  alert('Filter Removed')
  window.location.reload()
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
    getBloodNeeds();

  },[])

  
  return (
    <div>
        <Navbar/>
        <div className='dB'>Donate Blood</div>
        <div className="filter">
        <input type="text" className='input' placeholder='Address' value={address} onChange={(e)=>setAddress(e.target.value)}/>
        <select className='bloodGroup' value={bloodGroup} onChange={(e)=>setBloodGroup(e.target.value)}>
        <option value="1" >Choose Blood Group:</option>
        <option value="A+">A+</option>
        <option value="A-">A-</option>
        <option value="B+">B+</option>
        <option value="B-">B-</option>
        <option value="O+">O+</option>
        <option value="O-">O-</option>
        <option value="AB+">AB+</option>
        <option value="AB-">AB-</option>
        
    </select>
        <button className='filterBtn' onClick={getBloodNeeds}>Apply filter</button>
        <button className='filterBtn' onClick={()=>removeFilter()}>Remove filter</button>
        </div>
        <div className="allBlood">
        
        {bloodData.map((p, index) => (
     
         
          <div className={ p.requester?._id === id ?"bloodCard green":" bloodCard "} key={index} >
           
           <div className='bGroup' > <div> BloodGroup:</div> <div> {p.bloodGroup}
           </div> </div>
           <div className='bName' > <div>Patient Name:</div> <div>{p.patientName}</div>  </div>
           <div className='bEmail' > <div>Requester:</div> <div>{p.requester?.name || "Unknown"}</div>  </div>
           <div className='bMobile' > <div> Units Required:</div> <div>{p.units}</div> </div>
           <div className='bHospital' > <div>Hospital:</div> <div>{p.hospitalName}</div>  </div>
           <div className='bAddress' ><div>City:</div> <div>{p.city}</div>  </div>
           {p.requester?._id !== id && (
             <button className='acceptBtn' onClick={()=>handelAccept(p._id)}>Accept</button>
           )}
           </div>
            
        ))}
        </div>
      
        
    </div>
  )
}

export default DonateBlood
