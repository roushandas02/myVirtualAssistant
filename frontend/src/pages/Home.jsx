import React, { useContext, useEffect, useRef, useState } from 'react'
import { UserDataContext } from '../context/UserContext'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import aiImg from '../assets/ai.gif'
import userImg from '../assets/user.gif'
import { HiOutlineMenu } from "react-icons/hi";
import { RxCross2 } from "react-icons/rx";
// import assistantInitializeModal from './assistantInitializeModal'
import { HiMiniSpeakerWave } from "react-icons/hi2";



function Home() {
    const {userData,serverURL,setUserData,getGeminiResponse,cazz,setCazz}=useContext(UserDataContext)
    const [isSpeechPlayed, setIsSpeechPlayed] = useState(false);
    const [isRecognitionStarted, setIsRecognitionStarted] = useState(false);

    const navigate=useNavigate()
    const [listening,setListening]=useState(false);
    const [userText,setUserText]=useState("")
    const [aiText,setAiText]=useState("")

    const isSpeakingRef=useRef(false)
    const recognitionRef=useRef(null);
    const [ham,setHam]=useState(false)
    const isRecognizingRef=useRef(false)
    const synth=window.speechSynthesis
    const voicesRef = useRef([]);

    const [recognizedText, setRecognizedText] = useState("");

    useEffect(() => {
        if (!localStorage.getItem("hasReloaded")) {
            localStorage.setItem("hasReloaded", "true");
            window.location.reload();
        } else {
            localStorage.removeItem("hasReloaded");
        }
    }, []);

        

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


    //Speak Text
    function speakText(text) {
        // console.log("in speakText", text);
        if (synth.speaking) synth.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'en-US';

        const selectedVoice = voicesRef.current.find(voice => voice.lang === 'en-US');
        if (selectedVoice) {
            utterance.voice = selectedVoice;
        }

        utterance.onstart = () => {
            // console.log("Speaking started...");
            isSpeakingRef.current = true;
            if (recognitionRef.current) recognitionRef.current.stop();
        };

        utterance.onend = () => {
            // console.log("Speaking finished.");
            isSpeakingRef.current = false;
            setUserText("");     // Clear user text after response
            setAiText(""); 
            if (isSpeechPlayed && isRecognitionStarted) {
                setCazz("Listening...");
            }
            if (recognitionRef.current) recognitionRef.current.start();
        };

        utterance.onerror = (e) => {
            console.error("Speaking error:", e);
            isSpeakingRef.current = false;
            if (recognitionRef.current) recognitionRef.current.start();
        };

        synth.speak(utterance);
    }




    //Handle Type of Command Sent by Gemini
    const handleCommand= (data)=>{
        const {type, userInput, response}=data
        // console.log(response);
        setTimeout(() => {
            speakText(response);
        }, 100);
        // speak(response)

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
            // console.log("reached youtube ",query)
            window. open (`https://www.youtube.com/results?search_query=${query}`,'_blank');
        }
    }


    
    //Start Listening to User and send recognized text to gemini API
    function startListening() {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

        if (!SpeechRecognition) {
            alert("Sorry, your browser doesn't support Speech Recognition.");
            return;
        }

        if (!recognitionRef.current) {
            const recognition = new SpeechRecognition();
            recognition.lang = 'en-US';
            recognition.interimResults = false;
            recognition.maxAlternatives = 1;
            recognition.continuous = true; // ✅ continuous listening
            recognitionRef.current = recognition;

            recognition.onresult = async function (event) {
                const transcript = event.results[event.resultIndex][0].transcript;
                // console.log("heard:", transcript);
                setRecognizedText(transcript);
                setUserText(transcript);
                setCazz(transcript);

                if (transcript.toLowerCase().includes(userData.assistantName.toLowerCase())) {
                    recognition.stop(); // pause listening during response
                    const data = await getGeminiResponse(transcript);
                    handleCommand(data);
                    setUserText("");
                    setAiText(data.response);
                    setCazz(data.response);
                }
            };

            recognition.onend = function () {
                // Restart recognition after speaking is done
                if (!isSpeakingRef.current) {
                    recognition.start();
                }
            };

            recognition.onerror = function (event) {
                console.error("Speech recognition error:", event.error);
                setRecognizedText("Error: " + event.error);
            };
        }

        if (!isRecognizingRef.current) {
            recognitionRef.current.start();
            setRecognizedText("Listening... 🎙️");
            isRecognizingRef.current = true;
        }
    }




    


  return (
    <div className='w-full h-[100vh] bg-gradient-to-t from-[black] to-[#030353] flex justify-center items-center flex-col gap-[15px] overflow-hidden'>
        
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
        
        
        {/* Assistant Image, Name and GiF------------------------------------------------------------------- */}
        <div className='w-[300px] h-[400px] flex justify-center items-center overflow-hidden rounded-4xl shadow-1g'>
            <img src={userData?.assistantImage} alt="" className='h-full object-cover'/>
        </div>
        <h1 className='text-white text-[22px] font-semibold'>I'm {userData?.assistantName}</h1>
        {!aiText && <img src={userImg} alt="" className='w-[200px]' />}
        {aiText && <img src={aiImg} alt="" className='w-[200px]' />}
      
      
        {/* User Text/AI Text/Listening... Display -----------------------------------------------------------------*/}
        <p className="text-white font-semibold text-[22px]">{cazz}</p>



  

        {/* Assistant Initialize Modal -------------------------------------------------------------------------------*/}
        {/* <!-- Button trigger modal --> */}
        <button type="button" id='initializeAsst' class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#staticBackdrop">
            Initialize Your Assistant
        </button>
        {/* <!-- Modal --> */}
        <div class="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                <div class="modal-header">
                    <h1 class="modal-title fs-5" id="staticBackdropLabel">Initialize Your Assistant</h1>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div className="modal-body">
                <br />

                {/* First Row: Speech Played */}
                <div className="d-flex align-items-center gap-2">
                    <input type="checkbox" id="speechCheck" className="form-check-input" checked={isSpeechPlayed} readOnly/>
                    <label htmlFor="speechCheck" className="form-check-label">Speech Played</label>

                    <button className="btn btn-primary"onClick={() => {
                        speakText("Hello, this is your assistant speaking");
                        setIsSpeechPlayed(true);
                    }}>
                        🔊 Test Speech
                    </button>
                </div>

                <br />

                {/* Second Row: Speech Recognition Started */}
                <div className="d-flex align-items-center gap-2">
                    <input type="checkbox" id="listeningCheck" className="form-check-input" checked={isRecognitionStarted} readOnly/>
                    <label htmlFor="listeningCheck" className="form-check-label">Recognition Started</label>

                    <button className="btn btn-primary" onClick={() => {
                        // startListening();
                        setIsRecognitionStarted(true);
                    }}>
                        🎤 Start Recognition
                    </button>
                </div>

                <br />
                </div>

                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    <button type="button" class="btn btn-primary" data-bs-dismiss="modal" disabled={!(isSpeechPlayed && isRecognitionStarted)} onClick={() => {
                        startListening();
                        setCazz("Listening...");
                        document.getElementById("initializeAsst").style.display="none";
                    }}>Finish</button>
                </div>
                </div>
            </div>
        </div>

    </div>
  )
}

export default Home
