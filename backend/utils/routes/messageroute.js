import express from 'express';
import { protectRoute } from '../middleware/midle.js';
import { getMessages, getuserforsidebar, markMessageAsSeen, sendMessage } from '../controler/messagecontroller.js';


const messageRouter = express.Router();


messageRouter.get("/users",protectRoute,getuserforsidebar);
messageRouter.put("/mark/:id",protectRoute,markMessageAsSeen);
messageRouter.post("/send/:id",protectRoute,sendMessage);
messageRouter.get("/:id", protectRoute, getMessages);




export default messageRouter;