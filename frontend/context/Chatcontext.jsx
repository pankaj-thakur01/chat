import { createContext, useContext, useEffect, useState } from "react";
import { AuthContext } from "./Authcontext";
import toast from "react-hot-toast";


export const ChatContext = createContext()


export const ChatProvider = ({ children })=>{

const [messages ,setmessages] = useState([]);
const [users , setusers] = useState([])
const [selecteduser , setSelecteduser] = useState(null)
const [unseenMessages , setunseenMessages] = useState({})
const {socket , axios} = useContext(AuthContext);

// function to get all users for sidebar

const getUser = async ()=>{

    try {
     const {data} =  await axios.get("/api/messages/users");
if(data.success){
  setusers(data.users)
  console.log(data.users)
setunseenMessages(data.unseenMessages || {});

}

    } catch (error) {
        toast.error(error.message)
    }
}


// function to get messages for seleted user

const getMessages = async (userId) => {
  try {
    const { data } = await axios.get(`/api/messages/${userId}`);
    if (data.success) {
      setmessages(data.messages);
    } else {
      toast.error(data.message || "Failed to fetch messages");
    }
  } catch (error) {
    toast.error(error.response?.data?.message || error.message);
  }
};




// function to send message to selected user
const sendMessage = async (messageData)=>{
try {
    const {data} = await axios.post(`/api/messages/send/${selecteduser._id}`,messageData)
    console.log(data)
if(!data.success){
    setmessages((prevMessages)=>[...prevMessages,data.newMessage])
}else{
    toast.error(data.message);
}

} catch (error) {
    toast.error(error.message);
}
}


// function to subscribe to messages for selected user

const subsribetoMessages = async ()=>{

    if(!socket) return;

socket.on("newMessage", (newMessage)=>{
if(selecteduser && newMessage.senderId === selecteduser._id){
  newMessage.seen = true;
  setmessages((prevMessages)=>[...prevMessages,newMessage]);
axios.put(`/api/messages/mark/${newMessage._id}`);

}else{
setunseenMessages((prevUnseenMessages)=>({
...prevUnseenMessages,[newMessage.senderId] : prevUnseenMessages[newMessage.senderId] ? prevUnseenMessages[newMessage.senderId] + 1 : 1
}))
}
})
}



// function to unsubscribe from messages 
const unsubscribefromMessages = ()=>{
   if(socket) socket.off("newMessage");

}


useEffect(()=>{
subsribetoMessages();
return ()=> unsubscribefromMessages();
},[socket,selecteduser])


    const value = {

        messages,users,selecteduser,getUser,getMessages,sendMessage,setSelecteduser,unseenMessages,setunseenMessages
    }

   return <ChatContext.Provider value={value}>
{children}
   </ChatContext.Provider>



}


