import { useContext, useEffect, useState } from "react";
import { chatState } from "@/context/chatProvider";
import { Box, Text } from "@chakra-ui/react";
import { FaArrowLeftLong } from "react-icons/fa6";
import { Button, Container, Form, Spinner } from "react-bootstrap";
import { getSender, getSenderFull } from "@/config/ChatLogics";
import UserProfileModal from "./UserProfileModal";
import UpdateGroupChatModal from "./UpdateGroupChatModal";
import axios from "axios";
import { toast } from "react-toastify";
import ScrollAbleChat from "./ScrollAbleChat";
import whatsapp from "../../src/assets/whatsapp.jpg"
import { io } from "socket.io-client";
import { CgProfile } from "react-icons/cg";




 const ENDPOINT="https://chatapp-production-31d4.up.railway.app";
 var socket,selectedChatCompare;
const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const { user, selectedChat, setSelectedChat,notification,setNotification } = chatState();
  const [showModal, setShowModal] = useState(false);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [socketConnected,setSocketConnected]=useState(false)
  const [typing,setTyping]=useState(false)
  const [istyping,setIsTyping]=useState()


  const fetchMessages = async () => {
    if (!selectedChat) return;
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
  
      setLoading(true);
      const { data } = await axios.get(
        `https://chatapp-production-31d4.up.railway.app/api/message/${selectedChat._id}`,
        config
      );
  
      if (!Array.isArray(data)) {
        console.error("API response is not an array:", data);
        toast.error("Unexpected response format from server");
        return;
      }
  
      setMessages(data);
      console.log(data);
      
      setLoading(false);

      socket.emit("join chat", selectedChat._id);

      } catch (error) {
      toast.error("Failed to Load the Messages");
      console.error("Fetch Messages Error:", error);
    }
  };

    
      useEffect(()=>{
      fetchMessages()
      selectedChatCompare =selectedChat
    },[selectedChat])

  const sendMessage = async (event) => {
    if (event.key === "Enter" && newMessage) {
      if (!selectedChat || !user) return;

      try {
        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };

        const messageToSend = newMessage;
        setNewMessage("");

        const { data } = await axios.post(
          "https://chatapp-production-31d4.up.railway.app/api/message",
          { content: messageToSend, chatId: selectedChat._id },
          config
        );
        console.log(data);

        socket.emit("send Message",data)
        
        setMessages([...messages, data]);

      } catch (error) {
        toast.error("Failed to send the message");
      }
    }
  };
  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user);
    socket.on("connected", () => setSocketConnected(true));
    socket.on("typing", () => {
      // console.log("Received typing event");
      setIsTyping(true);
    });

    socket.on("stop typing", () => {
      // console.log("Received stop typing event");
      setIsTyping(false);
    });

    //Cleanup on unmount
    return () => {
      socket.disconnect();
    }; 
   }, []);


  
   useEffect(() => {
    socket.on("message recieved", (newMessageReceived) => {
      if (
        !selectedChatCompare ||
        selectedChatCompare._id !== newMessageReceived.chat._id
      ) {
        if (!notification.includes(newMessageReceived)) {
          setNotification([newMessageReceived, ...notification]);
          console.log("Updated notification:", [newMessageReceived, ...notification]);
          setFetchAgain(!fetchAgain);
        }
      } else {
        setMessages([...messages, newMessageReceived]);
      }
    });

    // Cleanup listener
    return () => {
      socket.off("message recieved");
    };
  }, [messages]); // Dependency on messages ensures the latest state is used
   console.log(notification);

const typingHandler = (e) => {
  setNewMessage(e.target.value);

  if (!socketConnected || !selectedChat) return;

  if (!typing) {
    setTyping(true);
    socket.emit("typing", selectedChat._id);
  }

  let lastTypingTime = new Date().getTime();
  setTimeout(() => {
    let currentTime = new Date().getTime();
    let timeDiff = currentTime - lastTypingTime;

    if (timeDiff >= 3000 && typing) {
      socket.emit("stop typing", selectedChat._id);
      setTyping(false);
    }
  }, 3000);
};
  
  return (
    <>
      {selectedChat ? (
        <>
          <Text
            fontSize={{ base: "28px", md: "30px" }}
            pb={3}
            px={2}
            w="100%"
            display="flex"
            justifyContent="space-between"
            gap={8}
          
            alignItems="center"
            color="white"
            fontWeight={700}
          >
            <Button
              style={{background:"transparent" ,border:"none" }}
              onClick={() => setSelectedChat("")}
            >
              <FaArrowLeftLong size={30}  />
            </Button>
    {selectedChat?.isGroupChat
      ? selectedChat?.chatName?.toUpperCase()
      : getSender(user, selectedChat?.users)}

                
            {selectedChat.isGroupChat && (
              <UpdateGroupChatModal
                fetchAgain={fetchAgain}
                setFetchAgain={setFetchAgain}
                fetchMessages={fetchMessages}
              />
            )}
            {!selectedChat.isGroupChat && (
              <Button
              style={{border:"none"}}
                className="ms-2 bg-transparent "
                onClick={() => setShowModal(true)}
              >
                <CgProfile size={50} style={{color:"lightblue"}} />

              </Button>
            )}
          </Text>

          {!selectedChat.isGroupChat && (
            <UserProfileModal
              show={showModal}
              onClose={() => setShowModal(false)}
              user={getSenderFull(user, selectedChat.users)}
            />
          )}

          <Box
            display="flex"
            flexDirection="column"
            justifyContent="flex-end"
            p={3}
            background="transparent"
            bgRepeat="no-repeat"
            w="100%"
            h="100%"
            borderRadius="lg"
            overflowY="hidden"
          >
            {loading ? (
  <Container fluid className="d-flex vh-100 justify-content-center align-items-center">
    <Spinner animation="border" role="status" size="large" />
  </Container>
) : (
  <>
    <div className="messages">
     <ScrollAbleChat messages={messages}/>
    </div>
  </>
)}

          {istyping && (
              <Text fontSize="xl" color="gray.400" ml={2}>
                Typing ...
              </Text>
            )}
            <Form.Control
              type="text"
              onKeyDown={sendMessage}
              placeholder="Enter the message"
              style={{ backgroundColor: "#e0e0e0" }}
              onChange={typingHandler}
              value={newMessage}

              mt="6"
              required
            />
          </Box>
        </>
      ) : (
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          // backgroundImage={`url(${whatsapp})`}  // Fix: Use url() properly


          h="100vh"
        >
          <Text fontSize="3xl" className="text-white fs-1">
            Click on a user to start chatting
          </Text>
        </Box>
      )}
    </>
  );
};

export default SingleChat;
