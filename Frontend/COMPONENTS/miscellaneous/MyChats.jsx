import { chatState } from '@/context/chatProvider';
import { Box, Stack, Text, Button } from '@chakra-ui/react';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { IoAddCircleOutline } from 'react-icons/io5';
import { toast } from 'react-toastify';
import ChatLoading from './ChatLoading';
import { getSender } from '../../src/config/ChatLogics';
import GroupChatModal from './GroupChatModal';
import whatsapp from "../../src/assets/background2.png"


const MyChats = ({fetchAgain}) => {
  const [loggedUser, setLoggedUser] = useState();
  const { user, selectedChat, setSelectedChat, chats, setChats } = chatState();

  const fetchChats = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get(`http://localhost:5000/api/chat`, config);
      setChats(data);
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
    fetchChats();
  }, [fetchAgain]); // Dependency updated

  return (
    <Box
      display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
      flexDirection="column"
      p={3}
      backgroundImage={`url(${whatsapp})`}  // Fix: Use url() properly
      w={{ base: "100%", md: "31%" }}
      h="90vh"
      borderRadius="lg"
      borderWidth="1px"
    >
      <Box
        pb={3}
        px={3}
        gap={30}
        fontSize={{ base: "28px", md: "30px" }}
        fontFamily="Work Sans"
        display="flex"
        justifyContent="space-between" // Fixed issue here
        alignItems="center"
      >
        <Text className='text-white'>Your Chats</Text>

        <GroupChatModal>
        <Button
          leftIcon={<IoAddCircleOutline />}
          fontSize="17px"
          colorScheme="blue"
          bg={"green"}
          color="white"
          borderRadius="lg"
        >
          New Group
        </Button>
        </GroupChatModal>
      </Box>

      <Box
        display="flex"
        flexDirection="column"
        p={3}
        bg="transparent"
        w="100%"
        h="100%"
        borderRadius="lg"
        overflowY="auto"
      >
        {chats ? (
          <Stack>
            {chats.map((chat) => (
              <Box
                key={chat._id}
                onClick={() => setSelectedChat(chat)} // Fixed issue
                cursor="pointer"
                background="black"
                color="white"
                px={3}
                display="flex"
                alignItems="center"
                gap={10}

                py={2}
                borderRadius="lg"


              >
                     <img
  src={chat.users.find((u) => u._id !== loggedUser?._id)?.pic || "https://via.placeholder.com/50"}
  alt="User"
  className="rounded-circle img-fluid"
  style={{
    width: "50px",
    height: "50px",
    objectFit: "cover",
    borderRadius: "50%",
  }}
/>


                <Text className='fs-5'>
                <strong> {!chat.isGroupChat ? getSender(loggedUser, chat.users) : chat.chatName}</strong> 
                </Text>
              </Box>
            ))}
          </Stack>
        ) : (
          <ChatLoading />
        )}
      </Box>
    </Box>
  );
};

export default MyChats;
 