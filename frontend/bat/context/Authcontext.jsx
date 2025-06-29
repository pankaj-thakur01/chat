import { createContext, useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { io } from 'socket.io-client';


const backendUrl = import.meta.env.VITE_BACKEND_URL;
axios.defaults.baseURL = backendUrl;


export const AuthContext = createContext();

export const AuthProvider = ({children})=>{

  const [token , settoken] = useState(localStorage.getItem("token"))
  const [authUser,setauthuser] = useState(null);
  const [onlineUsers ,setonlineUsers] = useState([]);
  const [socket ,setsocket] = useState(null);




// cheak if user is authenticated and if so , set the user data and connect the Socket  

const cheakAuth = async ()=>{

    try {
       const {data}  = await axios.get("/api/auth/check")
 if(data.success){
    setauthuser(data.user)
  connectSocket(data.user)

 }
    } catch (error) {
        toast.error(error.message)
    }
}


// login function to handle user authenication and socket connection 

const login  = async (state,credentials)=>{


 try {
    const{ data } = await axios.post(`/api/auth/${state}`, credentials);
    console.log(data)
 if(data.success){
console.log("second")
    setauthuser(data.userData);
  connectSocket(data.userData);
axios.defaults.headers.common["token"] = data.token;
settoken(data.token)
localStorage.setItem("token",data.token);
toast.success(data.message)

 }else{
    toast.error(data.message)
 }

 } catch (error) {
    toast.error(error.message)
 }

}



// Logout function to handel user logout and socket disconnection

const logout = async()=>{

    localStorage.removeItem("token");
settoken(null);
setauthuser(null);
setonlineUsers([]);
axios.defaults.headers.common["token"] = null;
toast.success("Logged out successfully")
   socket.disconnect();
}







// Update profile function to handle user profile updates 

const updateProfile = async (body)=>{
  console.log(body)
try {
    const { data } = await axios.put("/api/auth/update-profile",body);
    console.log(data)
 if(data.success){
 setauthuser(data.user);
toast.success("profile update successfully")
 }


} catch (error) {
toast.error(error.response?.data?.message || error.message);
}
}










// connect socket function to handle socket connection and online users updates 
  const connectSocket = (userData)=>{
  if(!userData || socket ?.connected) return;
const newsocket = io(backendUrl,{
   query:{
     userId : userData._id,

   }

});
newsocket.connect();
setsocket(newsocket);

newsocket.on("getOnlineusers", (userIds) => {
    console.log("Received online user IDs: ", userIds);
    setonlineUsers(userIds);
})

  }    





useEffect(()=>{
 if(token){
   axios.defaults.headers.common["token"] = token;
 }
cheakAuth()
},[])

  const value = {
  axios,
  authUser,
  onlineUsers,
  socket,
  login,
  logout,
  updateProfile

  }


  return(
<AuthContext.Provider value={value}>
{children}
    
</AuthContext.Provider>

  )
}





