//Model 1 Utilities
import React, { useContext, useEffect, useRef, useState } from 'react'
import Card from '../components/Card'
import image1 from '../assets/image1.jpeg'
import image2 from '../assets/image2.jpeg'
import image3 from '../assets/image3.jpeg'
import image4 from '../assets/image4.jpeg'
import image5 from '../assets/image5.jpeg'
import image6 from '../assets/image6.jpeg'
import image7 from '../assets/image7.jpeg'
import { BiImageAdd } from "react-icons/bi";
import { UserDataContext } from '../context/UserContext'
import { useNavigate } from 'react-router-dom'
import { MdKeyboardBackspace } from "react-icons/md";

//Modal 2 utilities
// import React, { useContext, useState } from 'react'
// import { UserDataContext } from '../context/UserContext';
import axios from 'axios';
// import { MdKeyboardBackspace } from "react-icons/md";
// import { useNavigate } from 'react-router-dom';

import { FaArrowRight } from "react-icons/fa";
import { HiOutlineMenu } from "react-icons/hi";
import { RxCross2 } from "react-icons/rx";




function Customize() {
    const [ham,setHam]=useState(false)
    //Model 1 Utilities
    const {serverURL,userData,setUserData,frontendImage,setFrontendImage,backendImage,setBackendImage,selectedImage,setSelectedImage}=useContext(UserDataContext)
    const inputImage=useRef()
    const navigate=useNavigate()

    const handleImage=(e)=>{
        const file=e.target.files[0];
        setBackendImage(file)
        setFrontendImage(URL.createObjectURL(file))
    }

    //Modal 2 Utilities
    const [assistantName,setAssistantName]=useState(userData?.assistantName || "");
    const [loading,setLoading]=useState(false)
    const [isUpdated,setIsUpdated]=useState(false)
    // const navigate=useNavigate()

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
            
            // console.log(result.data)
            setUserData(result.data)
            setLoading(false)
            // navigate("/")
            setIsUpdated(true); 
        } catch (error) {
            setLoading(false)
            console.log(error)
        }
    }
    useEffect(() => {
    if (isUpdated && userData?.assistantName) {
        navigate("/");
    }
}, [isUpdated, userData]);


        //Handle Logout
    const handleLogout=async ()=>{
        try {
            const result=await axios.get(`${serverURL}/api/auth/logout`,{withCredentials:true})
            setUserData(null)
            navigate("/signin")
        } catch (error) {
            setUserData(null)
            console.log("Logout Error" ,error)
        }
    }

  return (
    <div className='w-full h-[100vh] bg-gradient-to-t from-[black] to-[#030353] flex justify-center items-center flex-col p-[20px] gap-[20px]'>
    

        
                {/* Hamburger Menu----------------------------------------------------------------- */}
                <HiOutlineMenu className='lg:hidden text-white absolute top-[20px] right-[20px] w-[25px] h-[25px]' onClick={()=>setHam(true)}/>
                <div className={`absolute lg:hidden top-0 w-full h-full bg-[#00000053] backdrop-blur-lg p-[20px] flex flex-col gap-[20px] items-start ${ham?"translate-x-0":"translate-x-full"} transition-transform`}>
                    <RxCross2 className=' text-white absolute top-[20px] right-[20px] w-[25px] h-[25px]' onClick={()=>setHam(false)}/>
                    <button className='min-w-[150px] h-[60px]  text-black  font-semibold bg-white rounded-full text-[19px]  cursor-pointer' onClick={()=>handleLogout()}>Logout</button>
                    <button className='min-w-[150px] h-[60px]  text-black  font-semibold bg-white rounded-full text-[19px]  px-[20px] py-[10px] cursor-pointer' onClick={()=>navigate("/customize")}>Customize Your Assistant</button>
        
                    <div className='w-full h-[2px] bg-gray-400'></div>
                    <h1 className=' text-white font-semibold text-[19px]'>History</h1>
                    <div className='w-full h-[400px] gap-[20px] overflow-y-auto flex flex-col ' >
                        {userData.history?.map ((his)=>(
                            <span className='text-gray-200 text-[18px] truncate mt-[20px]'> {his}</span>
                        ))}
                    </div>
                </div>
        
                {/* Without Hamburger on Large Screen-------------------------------------------------------         */}
                <button className='min-w-[150px] h-[60px] mt-[30px] text-black hidden lg:block font-semibold bg-white rounded-full text-[19px] absolute top-[20px] right-[20px] cursor-pointer' onClick={()=>handleLogout()}>Logout</button>
                <button className='min-w-[150px] h-[60px] mt-[30px] text-black hidden lg:block font-semibold bg-white rounded-full text-[19px] absolute top-[100px] right-[20px] px-[20px] py-[10px] cursor-pointer' onClick={()=>navigate("/customize")}>Customize Your Assistant</button>
                
                
    
    {/* // <div className='w-full h-[100vh] bg-gradient-to-t from-[white] to-[gray] flex justify-center items-center flex-col p-[20px] gap-[20px]'> */}
        {/* <img src="frontend\src\assets\Home.jpg" alt="" srcset="" /> */}
        {/* <span className='my-10 bg-gradient-to-r from-blue-400 via-purple-600 to-blue-800 bg-clip-text text-transparent text-8xl'><strong>Welcome to myAssistant</strong></span> */}
        <span className='my-10 bg-gradient-to-r from-indigo-500 via-pink-400 to-blue-400 bg-clip-text text-transparent text-8xl'><strong>Welcome to myAssistant</strong></span>
        <h4 className=' my-20 text-white italic w-[50%]'>An intelligent voice assistant that continuously listens, yet responds only when called by name — ensuring seamless, hands-free interaction.
Stay in control with privacy-first design and natural conversations, tailored just for you.</h4>
        
        {/* Modal 1- Set Up Assistant Image -------------------------------------------------------------------*/}
        <button class=" btn btn-outline-primary btn-lg d-inline-flex align-items-center gap-2 mt-4" data-bs-target="#exampleModalToggle" data-bs-toggle="modal">Set Up your Assistant <span><FaArrowRight /></span></button>
        <div class="modal fade modal-xl" id="exampleModalToggle" aria-hidden="true" aria-labelledby="exampleModalToggleLabel" tabindex="-1">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
            <div class="modal-header">
                <h1 class="modal-title fs-5" id="exampleModalToggleLabel">Set Up your Assistant (1/2)</h1>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <MdKeyboardBackspace className='absolute top-[30px] left-[30px] text-white w-[25px] h-[25px] cursor-pointer' onClick={()=>{
                navigate("/")
                }}/>
                <h1 className='my-10 text-black text-[30px] text-center'>Select Your <span className='text-blue-600'>Assistant Image</span></h1>
                <div className='container my-10 w-full max-w-[900px] flex justify-center items-center flex-wrap gap-[20px]'>
                    < Card image={image1}/>
                    < Card image={image2}/>
                    < Card image={image3}/>
                    < Card image={image4}/>
                    < Card image={image5}/>
                    < Card image={image6}/>
                    < Card image={image7}/>

                    <div className={`w-[100px] h-[180px] lg:w-[150px] lg:h-[250px] bg-[#030326] border-2 border- [blue] rounded-2xl overflow-hidden hover:shadow-2xl hover:shadow-blue-950 hover:border-4 hover:border-white cursor-pointer flex items-center justify-center ${selectedImage=="input"?"shadow-2xl shadow-blue-950 border-4 border-white":null}`} onClick={()=>{
                        inputImage.current.click()
                        setSelectedImage("input")
                    }}>
                        {!frontendImage && <BiImageAdd className='text-white w-[25px] h-[25px]' />}
                        {frontendImage && <img src={frontendImage} className='h-full object-cover'></img>}
                        
                    </div>
                    <input type="file" accept='image/*' hidden ref={inputImage} onChange={handleImage}/>
                </div>
                {/* {selectedImage && <button className='btn btn-primary min-w-[150px] h-[60px] mt-[30px] font-semibold cursor-pointer rounded-full text-[19px] cursor-pointer' onClick={()=>navigate("/customize2")}>Next</button>} */}
                
            </div>
            <div class="modal-footer">
                <button class="btn btn-primary" data-bs-target="#exampleModalToggle2" data-bs-toggle="modal" disabled={!(selectedImage || backendImage)}>Set Up Assistant Name</button>
            </div>
            </div>
        </div>
        </div>

        {/* Modal 2- Set Up Assistant Name ---------------------------------------------------------------------------------------*/}
        <div class="modal fade modal-xl" id="exampleModalToggle2" aria-hidden="true" aria-labelledby="exampleModalToggleLabel2" tabindex="-1">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
            <div class="modal-header">
                <h1 class="modal-title fs-5" id="exampleModalToggleLabel2">Set Up your Assistant (2/2)</h1>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class=" modal-body">
                <MdKeyboardBackspace className='absolute top-[30px] left-[30px] text-white w-[25px] h-[25px] cursor-pointer' onClick={()=>{
                            navigate("/customize")
                        }}/>
                        <h1 className='text-black text-[30px] text-center'>Enter Your <span className='text-blue-600'>Assistant Name</span></h1>
                        <div class="container my-20 mb-3">
                            {/* <label for="exampleFormControlInput1" class="form-label">Email address</label> */}
                            {/* <input type="text" class="form-control" required id="exampleFormControlInput1" placeholder="eg. Jarvis"/> */}
                            <input type="text" class="form-control w-100 border border-dark" id="exampleFormControlInput1" placeholder='eg. Jarvis' required  onChange={(e)=>setAssistantName(e.target.value)} value={assistantName} />
                        </div>   
            </div>
            <div class="modal-footer">
                <button class="btn btn-primary" data-bs-target="#exampleModalToggle" data-bs-toggle="modal">Back to Set Up Assistant Image</button>
                <button className='btn btn-success' disabled={loading || !assistantName} onClick={()=>{
                            // navigate("/")
                            
                            handleUpdateAssistant()
                        }}>{!loading?"Finally Create Your Assistant":"Loading..."}</button>
            </div>
            </div>
        </div>
        </div>


        
        
    </div>
  )
}

export default Customize
