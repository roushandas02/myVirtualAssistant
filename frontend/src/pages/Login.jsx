import React from 'react'
import bg from "../assets/authbg.jpg"
//From react icons
import { IoEye } from "react-icons/io5";
import { IoEyeOff } from "react-icons/io5";
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { UserDataContext } from '../context/UserContext';
import axios from "axios";

function Signup() {
    const [showPassword,setShowPassword]=useState(false);
    const {serverURL,userData,setUserData}=useContext(UserDataContext);
    const navigate=useNavigate();
    // const [name,setName]=useState("");
    const [err,setErr]=useState("");
    const [email,setEmail]=useState("");
    const [password,setPassword]=useState("");
    const [loading,setLoading]=useState(false);

    const handleLogin=async (e)=>{
        //Stops the refreshing on submit
        e.preventDefault();
        setErr("");
        setLoading(true);
        try {
            // console.log(name,email,password);
            const result=await axios.post(`${serverURL}/api/auth/login`,{
                email,password
            },{withCredentials:true})
            // console.log(result);
            setUserData(result.data)
            setLoading(false);
            navigate("/")
        } catch (error) {
            console.log("Login Error: ",error)
            setErr(error.response.data.message)
            setUserData(null)
            setLoading(false);
        }
    }
  return (
    <div className='w-full h-[100vh] bg-cover flex justify-center items-center' style={{backgroundImage:`url(${bg})`}}>
        < form className='p-[20px] w-[90%] h-[600px] max-w-[500px] bg-[#00000062] backdrop-blur shadow-lg shadow-black flex flex-col items-center justify-center gap-[20px]' onSubmit={handleLogin}>
            <h1 className='text-white text-[30px] font-semibold mb-[30px]'>LogIn to <span className='text-blue-400'>Virtual Assistant</span></h1>
            {/* <input type="text" placeholder='Enter your Name' required className='w-full h-[60px] outline-none border-2 border-white bg-transparent text-white placeholder-gray-300 px-[20px] pу-[10px] rounded-full text-[18px]' onChange={(e)=>setName(e.target.value)} value={name} /> */}
            <input type="email" placeholder='Email' className='w-full h-[60px] outline-none border-2 border-white bg-transparent text-white placeholder-gray-300 px-[20px] pу-[10px] rounded-full text-[18px]' required onChange={(e)=>setEmail(e.target.value)} value={email}/>
            <div className='w-full h-[60px] border-2 border-white bg-transparent text-white rounded-full text-[18px] relative'>
                <input type={showPassword?"text":"password"} placeholder='password' className='w-full h-full rounded-full outline-none bg-transparent placeholder-gray-300 px-[20px] py-[10px]'required onChange={(e)=>setPassword(e.target.value)} value={password} />
                {!showPassword && <IoEye className='absolute top-[18px] right-[20px] w-[25px] h-[25px] text-[white] cursor-pointer' onClick={()=>setShowPassword(true)}/>}
                {showPassword && <IoEyeOff className='absolute top-[18px] right-[20px] w-[25px] h-[25px] text-[white] cursor-pointer' onClick={()=>setShowPassword(false)}/>}
            </div>
              {err. length>0 && <p className='text-red-500 text-[17px]'> *{err} </p>}

            <button className='btn btn-primary min-w-[150px] h-[60px] mt-[30px] font-semibold rounded-full text-[19px] cursor-pointer' disabled={loading}>{loading?"Loading...":"Log In"}</button>
            <p className='text-[white] text-[18px] '>Want to create a new Account? <span className='text-blue-400 cursor-pointer' onClick={()=>navigate("/signup")}>Sign Up</span></p>
        </form>
    </div>
  )
}

export default Signup
