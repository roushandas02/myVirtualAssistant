import React, { useContext, useState } from 'react'
import { UserDataContext } from '../context/UserContext';
import axios from 'axios';
import { MdKeyboardBackspace } from "react-icons/md";
import { useNavigate } from 'react-router-dom';


function Customize2() {
    const {userData,backendImage,selectedImage,serverURL,setUserData}=useContext(UserDataContext)
    const [assistantName,setAssistantName]=useState(userData?.assistantName || "");
    const [loading,setLoading]=useState(false)
    const navigate=useNavigate()

    const handleUpdateAssistant=async ()=>{
        setLoading(true)
        try {
            //FormData is a class which is used here as images need to either convert to base64 or appended to form
            let formData=new FormData()
            formData.append("assistantName",assistantName);
            if(backendImage){
                formData.append("assistantImage",backendImage);
            }else{
                formData.append("imageUrl",selectedImage);
            }
            const result=await axios.post(`${serverURL}/api/user/update`,formData,{withCredentials:true})
            
            console.log(result.data)
            setUserData(result.data)
            setLoading(false)
            navigate("/")
        } catch (error) {
            setLoading(false)
            console.log(error)
        }
    }
  return (
    <div className='w-full h-[100vh] bg-gradient-to-t from-[black] to-[#030353] flex justify-center items-center flex-col p-[20px] gap-[20px] relative'>
        <MdKeyboardBackspace className='absolute top-[30px] left-[30px] text-white w-[25px] h-[25px] cursor-pointer' onClick={()=>{
            navigate("/customize")
        }}/>
        <h1 className='text-white text-[30px] text-center'>Enter Your <span className='text-blue-200'>Assistant Name</span></h1>
        <input type="text" placeholder='eg. Jarvis' required className='w-full max-w-[600px] h-[60px] outline-none border-2 border-white bg-transparent text-white placeholder-gray-300 px-[20px] pу-[10px] rounded-full text-[18px]' onChange={(e)=>setAssistantName(e.target.value)} value={assistantName} />

        {assistantName && <button className='btn btn-primary min-w-[300px] h-[60px] mt-[30px] font-semibold cursor-pointer rounded-full text-[19px] cursor-pointer' disabled={loading} onClick={()=>{
            // navigate("/")
            
            handleUpdateAssistant()
        }}>{!loading?"Finally Create Your Assistant":"Loading..."}</button>}
        
    </div>
  )
}

export default Customize2
