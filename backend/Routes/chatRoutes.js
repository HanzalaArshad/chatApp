const express = require("express");
const { protect } = require("../Middleware/authMiddleware");
const { accessChat, fetchChats, createGroupChat, renameGroup, addToGroup, removeFromGroup } = require("../Controllers/chatController"); // ✅ Ensure correct import

const router = express.Router();

router.route("/").post(protect, accessChat);
router.route("/").get(protect,fetchChats);
router.route("/group").post(protect,createGroupChat)
router.route("/rename").put(protect,renameGroup)
router.route("/addgroup").put(protect,addToGroup)
router.route("/removegroup").put(protect,removeFromGroup)



module.exports = router; 
