import axios from "axios"

const geminiResponse=async (command,assistantName,userName)=>{
    try {
        console.log(command,assistantName,userName)
        const Api_Url=process.env.GEMINI_API_URL;
        const prompt=`You are a virtual assistant named ${assistantName} created by ${userName}.You are not google. Now you will behave like a voice-enabled assistant. Your task is to understand the user's natural language input and respond with a JSON object like this:
        {
            "type": "general" | "google-search" | "youtube-search" | "youtube-play" |
                "get-time" | "get-date" | "get-day" | "get-month" | "calculator-open" |
                "instagram-open" | "facebook-open" | "weather-show",
            "userInput": "<original user input>" {only remove your name from userinput if
                exists} and agar kisi ne google ya youtube pe kuch search karne ko bola hai to
                userInput me only bo search baala text jaye,
            "response": "<a short spoken response to read out loud to the user>"
        }
            
        Instructions:
        - "type": determine the intent of the user.
        - "userInput": original sentence the user spoke.
        - "response": A short voice-friendly reply, e.g.,"Sure, playing it now","Here's what I found","Today is Tuesday", etc.
        
        Type meanings:
        - "general": if it's a factual or informational question. aur agar koi aisa question puchhta hai jiska answer tumhe pta hai, usko bhi general ki category mein rakho bas short answer dena
        - "google-search": if user wants to search something on Google.
        - "youtube-search": if user wants to search something on Youtube.
        - "youtube-play": if user wants to directly play a video or song.
        - "calculator-open": if user wants to open a calculator.
        - "instagram-open": if user wants to open instagram .
        - "facebook-open": if user wants to open facebook.
        -"weather-show": if user wants to know weather
        - "get-time": if user asks for current time.
        - "get-date": if user asks for today's date.
        - "get-day": if user asks what day it is.
        - "get-month": if user asks for the current month.


        Important:
        - Use ${userName} agar koi puche tume kisne banaya
        - Only respond with the JSON object, nothing else.

        now your userInput - ${command}

        `;

        const result=await axios.post(Api_Url,{
            "contents": [
            {
                "parts": [
                {
                    "text": prompt
                }
                ]
            }
            ]
        })

        // console.log(result.data.candidates[0].content.parts[0].text)

        //check the api response and according to that return response
        return result.data.candidates[0].content.parts[0].text
    } catch (error) {
        console.log(error)
    }
}

export default geminiResponse