const asyncHandler = require("express-async-handler");
const generateToken = require("../config/generateToken");
const User = require("../models/user.Model");
const { default: mongoose } = require("mongoose");

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, pic } = req.body;

  if (!name || !email || !password) {
    res.status(400); // Change 404 to 400 (Bad Request)
    throw new Error("Please enter all the fields");
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error("Email already exists");
  }

  const user = await User.create({
    name,
    email,
    password,
    pic,
  });

  if (user) {
    res.status(201).json({ 
      _id: user._id,
      name: user.name,
      email: user.email,
      pic: user.pic,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error("Failed to create the user");
  }
});

const authUser= asyncHandler(async(req,res)=>{
       const {email,password}=req.body;
       
       const user=await User.findOne({email});

       if(user &&(await user.matchPassword(password))){

        res.json({
          _id:user._id,
          name:user.name,
          email:user.email,
          pic:user.pic,
          token: generateToken(user._id),

        })
       }else{
        res.status(401);
        throw new Error("Invalid password and issue ")
       }
});


//  /api/user?search=hanzala
const allUsers= asyncHandler(async(req,res)=>{
    const keyword=req.query.search ?{
        $or:[
          {name:{$regex:req.query.search,$options:"i"}},
          {email:{$regex:req.query.search,$options:"i"}},

        ]
    }:{}

    const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });
    return res.status(200).json(users);

    
})
module.exports = { registerUser,authUser,allUsers};
