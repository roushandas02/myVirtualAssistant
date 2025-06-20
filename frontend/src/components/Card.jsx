import React, { useContext } from 'react'
import { UserDataContext } from '../context/UserContext'

function Card({image}) {
    const {serverURL,userData,setUserData,frontendImage,setFrontendImage,backendImage,setBackendImage,selectedImage,setSelectedImage}=useContext(UserDataContext)
  return (
    <div className={`w-[100px] h-[180px] lg:w-[150px] lg:h-[250px] bg-[#030326] border-2 border- [blue] rounded-2xl overflow-hidden hover:shadow-2xl hover:shadow-blue-950 hover:border-4 hover:border-white cursor-pointer ${selectedImage==image?"shadow-2xl shadow-blue-950 border-4 border-white":null}`} onClick={()=>{
        setSelectedImage(image),
        setBackendImage(null),
        setFrontendImage(null)
    }}>
        <img src={image} className='h-full object-cover'/>
    </div>
  )
}

export default Card
