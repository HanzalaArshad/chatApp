import { chatState } from '@/context/chatProvider'
import { Box } from '@chakra-ui/react'
import React from 'react'
import SingleChat from './SingleChat'
import whatsapp from "../../src/assets/background2.png"


const ChatBox = ({fetchAgain,setFetchAgain}) => {

const {selectedChat}=chatState()
  return (
    <Box 
    display={{base:selectedChat?"flex":"none",md:"flex"}}
    alignItems="center"
    flexDirection="column"
    backgroundImage={`url(${whatsapp})`} 
    backgroundSize="cover" // Fix: Use url() properly
    bgRepeat="no-repeat"
    
    p={3}
    w={{base:"100vw",md:"68vw"}}
    h="90vh"
    borderRadius="lg"
    borderWidth="1px"
    >
      <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain}/>
    </Box>
  )
}

export default ChatBox
