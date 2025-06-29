
import Message from "../models/message.js";
import User from "../models/user.js";
import cloudinary from "../lib/cloudnary.js";
import { io, userSocketMap } from "../../server.js";




// Get all users except the logged in user


export const getuserforsidebar = async (req, res) => {
  try {
    const userId = req.user._id;
    const filteredusers = await User.find({ _id: { $ne: userId } }).select("-pass");




    // Count number of message not seen 
    const unseenmessages = {};
    const promises = filteredusers.map(async (user) => {
      const messages = await Message.find({ senderId: user._id, receiverId: userId, seen: true });
      console.log(messages)
      if (messages.length > 0) {
        unseenmessages[user._id] = messages.length;
      }
    });

    await Promise.all(promises);

    res.json({ success: true, users: filteredusers, unseenmessages });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};



// Get all message for selected user 

export const getMessages = async (req, res) => {
  try {
    const { id: selecteduserId } = req.params;
    const myId = req.user._id;

    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: selecteduserId },
        { senderId: selecteduserId, receiverId: myId },
      ]
    })

    await Message.updateMany({ senderId: selecteduserId, receiverId: myId }, { seen: true });

    res.json({ success: true, messages })
  } catch (error) {
    console.log(error.message)
    res.json({ success: false, message: error.message })
  }
}




// api to mark message as seen using message id

export const markMessageAsSeen = async (req, res) => {
  try {
    const { id } = req.params;
    await Message.findByIdAndUpdate(id, { seen: true })
    res.json({ success: true })


  } catch (error) {
    console.log(error.message)
    res.json({ success: false, message: error.message })
  }

}





// send message to selected user 

export const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    const receiverId = req.params.id;
    const senderId = req.user._id;

    let imageUrl;
    if (image) {
      const uploadResponce = await cloudinary.uploader.upload(image)
      imageUrl = uploadResponce.secure_url;
    }

    const newMessage = await Message.create({
      senderId,
      receiverId,
      text,
      image: imageUrl
    })

    // Emit the new message to the receiver's socket
    const receiverSocketId = userSocketMap[receiverId];
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage)
    }
    res.json({ success: false, newMessage });


  } catch (error) {
    console.log(error.message)
    res.json({ success: false, message: error.message })
  }
}
