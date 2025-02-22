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

 const ENDPOINT="http://localhost:5000";
 var socket,selectedChatCompare;
const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const { user, selectedChat, setSelectedChat } = chatState();
  const [showModal, setShowModal] = useState(false);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [socketConnected,setSocketConnected]=useState(false)


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
        `http://localhost:5000/api/message/${selectedChat._id}`,
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
          "http://localhost:5000/api/message",
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
    // socket.on("typing", () => setIsTyping(true));
    // socket.on("stop typing", () => setIsTyping(false));

    // eslint-disable-next-line
  }, []);


  useEffect(()=>{
    socket.on( "message recieved",(newMessageRecieved)=>{
      if(!selectedChatCompare || selectedChatCompare._id !==newMessageRecieved.chat._id){
        // give notification
      } else{
        setMessages([...messages,newMessageRecieved])
      }
    } )
})
  
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
              style={{backgroundColor:"darkblue" ,borderColor:"darkblue"}}
              onClick={() => setSelectedChat("")}
            >
              <FaArrowLeftLong />
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
                variant="primary"
                className="ms-2"
                onClick={() => setShowModal(true)}
              >
                Profile
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


            <Form.Control
              type="text"
              onKeyDown={sendMessage}
              placeholder="Enter the message"
              style={{ backgroundColor: "#e0e0e0" }}
              onChange={(e) => setNewMessage(e.target.value)}
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


          h="100%"
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
