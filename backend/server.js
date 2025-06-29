import express from 'express';
import 'dotenv/config';
import cors from 'cors';
import http from "http";
import { connectDB } from './utils/lib/db.js';
import userrouter from './utils/routes/routes.js';
import messageRouter from './utils/routes/messageroute.js';
import { Server } from 'socket.io';



const app = express();
const server = http.createServer(app);

// initialize socket.io server
export const io = new Server(server,{
  cors:{origin:"*"}
})

//  Store online users 
export const userSocketMap = {}; // {userId : socketId}


// Socket.io connection handler 
io.on("connection",(socket)=>{
const userId = socket.handshake.query.userId;
console.log("User Connected", userId);

if(userId) userSocketMap[userId] = socket.id;


// Emit online users to all connected clients 
io.emit("getOnlineusers",Object.keys(userSocketMap));

socket.on("disconnect",()=>{
 console.log("User Disconnect",userId);
delete userSocketMap[userId];
io.emit("getOnlineUsers",Object.keys(userSocketMap));

})

})




// Middleware
app.use(express.json({ limit: "4mb" }));
app.use(cors());




// Routes setup 
app.use("/ye", (req, res) => {  res.status(200).json({message : "this is home page"})}   );
app.use("/api/auth",userrouter)
app.use("/api/messages",messageRouter)

// Use uppercase PORT from .env or fallback to 5000
const PORT = process.env.PORT || 5000;

server.listen(PORT, () =>{
   connectDB()
  console.log(`server is running on http://localhost:${PORT}`)

});
