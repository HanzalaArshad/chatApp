const asyncHandler = require("express-async-handler");
const Chat = require("../models/chat.Model");
const User=require("../models/user.Model");
const { response } = require("express");
//@description     Create or fetch One to One Chat
//@route           POST /api/chat/
//@access          Protected
const accessChat = asyncHandler(async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    console.log("UserId param not sent with request");
    return res.sendStatus(400);
  }

  var isChat = await Chat.find({
    isGroupChat: false,
    $and: [
      { users: { $elemMatch: { $eq: req.user._id } } },
      { users: { $elemMatch: { $eq: userId } } },
    ],
  })
    .populate("users", "-password")
    .populate("latestMessage");

  isChat = await User.populate(isChat, {
    path: "latestMessage.sender",
    select: "name pic email",
  });

  if (isChat.length > 0) {
    res.send(isChat[0]);
  } else {
    var chatData = {
      chatName: "sender",
      isGroupChat: false,
      users: [req.user._id, userId],
    };

    try {
      const createdChat = await Chat.create(chatData);
      const FullChat = await Chat.findOne({ _id: createdChat._id }).populate(
        "users",
        "-password"
      );
      res.status(200).json(FullChat);
    } catch (error) {
      res.status(400);
      throw new Error(error.message);
    }
  }
});


const fetchChats=asyncHandler(async(req,res)=>{
      try {
         Chat.find({users:{$elemMatch:{$eq:req.user._id}}})
         .populate("users","-password")
         .populate("groupAdmin","-password")
         .populate("latestMessage")
         .sort({updatedAt:-1})
          .then(async(result)=>{
             result=await User.populate(result,{
              path:"latestMessagwe.sendder",
              select:"name,pic,email"
             });

             res.status(200).send(result);
          })
      } catch (error) {
           res.status(400);
           throw new Error(error.message)
      }
})


const createGroupChat = asyncHandler(async (req, res) => {
  // Check if required fields are provided
  if (!req.body.users || !req.body.name) {
    return res.status(400).json({ message: "Please fill all the fields" });
  }

  // Parse users from the request body (since it's sent as a string)
  let users = JSON.parse(req.body.users);

  // Check if at least 2 users are provided
  if (users.length < 2) {
    return res.status(400).json({ message: "More than two users are required to form a group" });
  }

  // Add the logged-in user to the group
  users.push(req.user._id);

  try {
    // Create the group chat in the database
    const groupChat = await Chat.create({
      chatName: req.body.name,
      users: users,
      isGroupChat: true,
      groupAdmin: req.user._id,
    });

    // Fetch the full details of the created group chat
    const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
      .populate("users", "-password") // Securely populate users
      .populate("groupAdmin", "-password"); // Securely populate group admin

    res.status(200).json(fullGroupChat);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});


const renameGroup=asyncHandler(async(req,res)=>{
     const {chatId,chatName}=req.body

     const updatedChat=await Chat.findByIdAndUpdate(
      chatId,
      {
        chatName,

      },{
        new:true,

      }
     ).populate("users","-password")
     .populate("groupAdmin","-password")

     if(!updatedChat){
      res.status(404);
      throw new Error("chat not Found")
     }

     else{
         res.json(updatedChat)
     }
})


const addToGroup=asyncHandler(async(req,res)=>{

  const {chatId,userId}=req.body
   
  const added=await Chat.findByIdAndUpdate(chatId,{
    $push:{users:userId},
  },
  {new:true}
)
.populate("users", "-password") // Securely populate users
.populate("groupAdmin", "-password"); // Securely populate group admin details

  if(!added){
    res.status(404);
    throw new Error("chat not Found")
  }
   else{
    res.json(added)
   }
})


const removeFromGroup=asyncHandler(async(req,res)=>{

  const {chatId,userId}=req.body
   
  const remove=await Chat.findByIdAndUpdate(chatId,{
    $pull:{users:userId},
  },
  {new:true}
)
.populate("users", "-password") // Securely populate users
.populate("groupAdmin", "-password"); // Securely populate group admin

  if(!remove){
    res.status(404);
    throw new Error("chat not Found")
  }
   else{
    res.json(remove)
   }
})



module.exports={accessChat,fetchChats,createGroupChat,renameGroup,addToGroup,removeFromGroup}