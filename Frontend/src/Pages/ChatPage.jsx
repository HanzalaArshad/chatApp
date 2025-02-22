import { chatState } from "@/context/chatProvider";
import React, { useState } from "react";
import SideDrawer from "../../COMPONENTS/miscellaneous/SideDrawer";
import { Box } from "@chakra-ui/react";
import MyChats from "../../COMPONENTS/miscellaneous/MyChats";
import ChatBox from "../../COMPONENTS/miscellaneous/ChatBox";

const ChatPage = () => {

  const {user}=chatState()

  
  const [fetchAgain,setFetchAgain]=useState();
  
  
  return <div style={{ width: "100%" }}>

    {user&& <SideDrawer/>}
    <Box
     display="flex"
     justifyContent="space-between"
     w='100%'
     h="91.5$vh"
     p='10px'

    >
    {user&&<MyChats fetchAgain={fetchAgain}/>}
    {user&& <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain}/>}
    </Box>
    {}
  </div>;
};

export default ChatPage;
