import React, { useContext, useEffect, useRef, useState } from 'react'
import { UserDataContext } from '../context/UserContext'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import aiImg from '../assets/ai.gif'
import userImg from '../assets/user.gif'
import { HiOutlineMenu } from "react-icons/hi";
import { RxCross2 } from "react-icons/rx";



function Home() {
    const {userData,serverURL,setUserData,getGeminiResponse}=useContext(UserDataContext)
    const navigate=useNavigate()
    const [listening,setListening]=useState(false);
    const [userText,setUserText]=useState("")
    const [aiText,setAiText]=useState("")
    const isSpeakingRef=useRef(false)
    const recognitionRef=useRef(null);
    const [ham,setHam]=useState(false)
    const isRecognizingRef=useRef(false)
    const synth=window.speechSynthesis

   

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

    const startRecognition=()=>{
        if(!isSpeakingRef.current && !isRecognizingRef.current){
            try {
                recognitionRef.current?.start()
                console.log("Recognition Requested to start")
            } catch (error) {
                if(error.name !== "InvalidStateError"){
                    console.error("Start Error: ",error);
                }
                
            }
        }
        
    }

//     navigator.mediaDevices.getUserMedia({ audio: true })
// .then(() => console.log("Mic access granted"))
// .catch((err) => console.error("Mic access denied", err));

// window.speechSynthesis.onvoiceschanged = () => {
//     const voices = window.speechSynthesis.getVoices();
//     console.log("Voices loaded", voices);
// };



    //Gemini text to Speech 
    const speak=(text)=>{
        const utterance=new SpeechSynthesisUtterance(text)
        utterance.lang='hi-IN';
        const voices=window.speechSynthesis.getVoices()
        const hindiVoice=voices.find(v=>v.lang==='hi-IN')
        if(hindiVoice){
            utterance.voice=hindiVoice;
        }
        isSpeakingRef.current=true
        utterance.onend=()=>{
            setAiText("")
            isSpeakingRef.current=false
            setTimeout(()=>{
               startRecognition()
            },800)
        }
        synth.cancel()
        synth.speak(utterance)
    }


//     useEffect(() => {
//   const transcript = "Who are you?"
//   getGeminiResponse(transcript).then(data => {
//     handleCommand(data)
//   })
// }, [])


    const handleCommand= (data)=>{
        const {type, userInput, response}=data
        console.log(response);
        speak(response)

        if (type === 'google-search'){
            const query = encodeURIComponent(userInput);
            window. open (`https://www.google.com/search?q=${query}`,'_blank');
        }
        if (type === 'calculator-open'){
            window. open (`https://www.google.com/search?q=calculator`,'_blank');
        }
        if (type === 'instagram-open'){
            window. open (`https://www.instagram.com/`,'_blank');
        }
        if (type === 'facebook-open'){
            window. open (`https://www.facebook.com/`,'_blank');
        }
        if (type === 'weather-show'){
            window. open (`https://www.google.com/search?q=weather`,'_blank');
        }
        if (type === 'youtube-search' || type==='youtube-play'){
            const query = encodeURIComponent(userInput);
            window. open (`https://www.youtube.com/results?search_query=${query}`,'_blank');
        }
    }


    // useEffect(() => {
    //     const speakGreeting = () => {
    //         const greeting = new SpeechSynthesisUtterance(`Hello ${userData?.name}, what can I help you with?`);
    //         greeting.lang = 'hi-IN';

    //         const voices = window.speechSynthesis.getVoices();
    //         const hindiVoice = voices.find(v => v.lang === 'hi-IN');
    //         if (hindiVoice) greeting.voice = hindiVoice;

    //         window.speechSynthesis.speak(greeting);
    //         console.log("Available Voices:", window.speechSynthesis.getVoices());

    //         console.log("greeted")
    //     };

    //     // Fix: wait for voices to load
    //     if (speechSynthesis.getVoices().length === 0) {
    //         speechSynthesis.onvoiceschanged = speakGreeting;
    //         console.log("greeted getvoices=0")

    //     } else {
    //         speakGreeting();
    //     }

    // }, [userData]);


    //User Speech to text by inbuilt Web Speech API
    useEffect(()=>{
        //  document.getElementById("btnGreet").click();
        const SpeechRecognition=window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition=new SpeechRecognition()
        //always listening
        recognition.continuous=true;
        recognition.lang='en-US'
        recognition.interimResults=false;

        recognitionRef.current=recognition

        let isMounted=true;//flag to avoit setState on unmounted items

        const startTimeout = setTimeout (() => {
            if(isMounted && !isSpeakingRef.current && !isRecognizingRef.current) {
                try{
                    recognition.start();
                    console.log("Recognition requested to start")
                }catch (e) {
                    if(e.name !== "InvalidStateError"){
                        console.error(e);
                    }
                }
            }
        },1000)


        recognition.onstart=()=>{
            console.log("Recognition Started")
            isRecognizingRef.current=true
            setListening(true)
        }

        recognition.onend=()=>{
            console.log("Recognition Ended")
            isRecognizingRef.current=false
            setListening(false)
            if(isMounted && !isSpeakingRef.current){
                setTimeout(()=>{
                    if(isMounted){
                        try {
                            recognition.start()
                            console.log("recognition restarted")
                        } catch (error) {
                            if(error.name !== "InvalidStateError"){
                                console.error("start error: ",error)
                            }
                        }
                    }
                },1000)
            }

        }

        recognition.onerror=(event)=>{
            console.warn("Recognition error: ",event.error)
            isRecognizingRef.current=false;
            setListening(false);
            if(event.error !== "aborted" && isMounted && !isSpeakingRef.current){
                setTimeout(()=>{
                    if(isMounted){
                        try {
                            recognition.start()
                            console.log("recognition restarted after error")
                        } catch (error) {
                            if(error.name !== "InvalidStateError"){
                                console.error("start error: ",error)
                            }
                        }
                    }
                },1000)
            }

        }

        recognition.onresult=async (e)=>{
            const transcript=e.result[e.result.length-1][0].transcript.trim();
            console.log("heard: "+transcript)

            if(transcript.toLowerCase().includes(userData.assistantName.toLowerCase())){
                setAiText("")
                setUserText(transcript)
                recognition.stop()
                isRecognizingRef.current=false
                setListening(false)
                const data=await getGeminiResponse(transcript)
                console.log(data)
                handleCommand(data)
                setAiText(data.response)
                setUserText("")
            }
        }
    


        //     const greeting = new SpeechSynthesisUtterance(` Hello ${userData.name}, what can I help you with?`);
        //     greeting.lang = 'hi-IN';
        //     console.log("greeted")
        //     window.speechSynthesis.speak(greeting);
        // //}

        return ()=>{
            isMounted=false
            clearTimeout(startTimeout)
            recognition.stop()
            setListening(false)
            isRecognizingRef.current=false
            // clearInterval(fallback)
        }

    },[])


    


  return (
    <div className='w-full h-[100vh] bg-gradient-to-t from-[black] to-[#030353] flex justify-center items-center flex-col gap-[15px] overflow-hidden'>
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

      <button className='min-w-[150px] h-[60px] mt-[30px] text-black hidden lg:block font-semibold bg-white rounded-full text-[19px] absolute top-[20px] right-[20px] cursor-pointer' onClick={()=>handleLogout()}>Logout</button>
      <button className='min-w-[150px] h-[60px] mt-[30px] text-black hidden lg:block font-semibold bg-white rounded-full text-[19px] absolute top-[100px] right-[20px] px-[20px] py-[10px] cursor-pointer' onClick={()=>navigate("/customize")}>Customize Your Assistant</button>
      <div className='w-[300px] h-[400px] flex justify-center items-center overflow-hidden rounded-4xl shadow-1g'>
      <img src={userData?.assistantImage} alt="" className='h-full object-cover'/>
      </div>
      <h1 className='text-white text-[22px] font-semibold'>I'm {userData?.assistantName}</h1>
      {!aiText && <img src={userImg} alt="" className='w-[200px]' />}
      {aiText && <img src={aiImg} alt="" className='w-[200px]' />}
      <h1 className='text-white text-[18px] font-semibold text-wrap'>{userText?userText:aiText?aiText:null}</h1>
      

    </div>
  )
}

export default Home
