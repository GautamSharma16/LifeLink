import React from 'react'
import Navbar from '../components/Navbar'
import { useNavigate } from 'react-router-dom'
import '../css/HomePage.css'
const HomePage = () => {
 const navigate=useNavigate()

  const handelDonate=()=>{
     navigate('/donate-blood')
  }
  return (
    <>
    <Navbar/>
     <div className="homeBox">
      <div className="homeImg">
          <img src="https://img.freepik.com/free-vector/blood-donor-nurse_74855-6262.jpg?t=st=1713415937~exp=1713419537~hmac=8508ec4d384bf899e61a4546dbebf8ea23a39a32c209789ddf1c969cf2abb2fe&w=900" alt="" />
      </div>
      <div className="homeText">
            <div className="mainHead">Donate <span>Blood</span>,  <p>Save <span> Life</span>.</p>  </div>
            <div className="para">Join the lifesaving movement – donate blood! Your single donation can save up to three lives. Be a hero to someone in need. Every drop counts. Give the gift of life today. Join us in making a difference. Donate blood and be a part of something truly meaningful.</div>
            <button className='donateBtn' onClick={handelDonate}>Donate Now</button>
      </div>
     </div>

      <div className="aboutHead">Who are we ?</div>
     <div className="aboutBox">
      <div className="aboutText">

    
      <div className="first">
        <div className="heading">Welcome to LifeLink</div>
        <div className="data">
        At LifeLink, we're dedicated to saving lives through blood donation.We've been at the forefront of ensuring a steady supply of safe and high-quality blood for those in need.
        </div>
      </div>
      <div className="first">
        <div className="heading">Our Mission</div>
        <div className="data">
        Our mission is simple yet profound: to bridge the gap between generous donors and patients requiring life-saving blood transfusions. We strive to make the donation process easy, comfortable, and rewarding for everyone involved.
        </div>
      </div>
      <div className="first">
        <div className="heading">What we do</div>
        <div className="data">
        We operate as a vital link in the healthcare system, facilitating the collection, testing, processing, and distribution of blood and blood products. Our state-of-the-art facilities and dedicated team ensure that every donation is handled with the utmost care and professionalism..
        </div>
      </div>
      </div>
      <div className="aboutImg">
        <img src="https://img.freepik.com/free-vector/hand-drawn-world-blood-donor-day-illustration_23-2148942371.jpg?t=st=1713438819~exp=1713442419~hmac=d27c9c4c13ff5a41ffe88314adffba7538089304f980e9cff6b2c05cc064b801&w=996" alt="" />
      </div>
     </div>




{/* second */}
     <div className="aboutHead">Some Points About Blood Donation</div>
     <div className="aboutBox">
     <div className="pointsImg">
        <img src="https://img.freepik.com/free-vector/flat-world-blood-donor-day-illustration_23-2149386191.jpg?t=st=1717393412~exp=1717397012~hmac=3a89c432c7509e2b9516093cc5800b4afbbdb8ac25534037c503dbb0a58b0c62&w=996" alt="" />
      </div>
      <div className="aboutText">

    
      <div className="first">
        <div className="heading">Who can Donate To Whom?</div>
        <div className="data">
        <li>O-: Can donate to all blood types (A+, A-, B+, B-, AB+, AB-, O+, O-). </li>
         <li> O+: Can donate to any Rh-positive blood types (A+, B+, AB+, O+).</li>
         <li>A-: Can donate to A+/- and AB+/-.</li>
          <li>A+: Can donate to A+ and AB+.</li>
          <li>B-: Can donate to B+/- and AB+/-.</li>
          <li>B+: Can donate to B+ and AB+</li>
          <li>AB-: Can donate to AB+/-</li>
          <li>AB+: Can donate to AB+ only. Universal recipient.</li>
        </div>
      </div>
      
      <div className="first">
        <div className="heading"> Donation</div>
        <div className="data">
        Before donating blood, stay hydrated, eat a healthy meal, rest well, wear comfortable clothing, avoid alcohol and certain medications, and bring identification. After donating, rest, hydrate, snack, avoid heavy exercise, monitor for reactions, and eat iron-rich foods.
        </div>
      </div>
      </div>
      
     </div>
    </>
  )
}

export default HomePage
