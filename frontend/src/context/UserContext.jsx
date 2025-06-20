import React, { useEffect, useState } from 'react'
import { createContext } from 'react'
import axios from "axios"

export const UserDataContext=createContext();

function UserContext({children}) {
  const serverURL="https://myvirtualassistant-backend.onrender.com"
  const [userData,setUserData]=useState(null)
  const [frontendImage,setFrontendImage]=useState(null);
  const [backendImage,setBackendImage]=useState(null);
  const [selectedImage,setSelectedImage]=useState(null);
  const [cazz,setCazz]=useState("")


  const handleCurrentUser=async ()=>{
    try {
      const result=await axios.get(`${serverURL}/api/user/current`,{withCredentials:true})
      setUserData(result.data);
      console.log(result.data)
    } catch (error) {
      console.log(error)
    }
  }
  useEffect(()=>{
    handleCurrentUser()
  },[])

  const getGeminiResponse=async (command)=>{
      try {
        // console.log(command);
        const result=await axios.post(`${serverURL}/api/user/asktoassistant`,{command},{withCredentials:true})
        // console.log("getgeminiresponse",result.data);
        return result.data
      } catch (error) {
        setCazz("Error Occured While Fetching! Please try again later.")
        setTimeout(()=>{
          setCazz("Listening...")
        },2000)
        console.log(error)
      }
  }


  const val={
    serverURL,userData,setUserData,frontendImage,setFrontendImage,backendImage,setBackendImage,selectedImage,setSelectedImage,getGeminiResponse,cazz,setCazz
  }
  return (
      <UserDataContext.Provider value={val}>
        {children}
      </UserDataContext.Provider>
  )
}

export default UserContext
