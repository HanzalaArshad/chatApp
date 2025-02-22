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
import { io } from "socket.io-client";

const ENDPOINT = "http://localhost:5000";
let socket, selectedChatCompare;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const { user, selectedChat, setSelectedChat } = chatState();
  const [showModal, setShowModal] = useState(false);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [socketConnected, setSocketConnected] = useState(false);

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user);
    socket.on("connected", () => setSocketConnected(true));
  }, [user]);

  useEffect(() => {
    if (!selectedChat) return;
    
    const fetchMessages = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(
          `http://localhost:5000/api/message/${selectedChat._id}`,
          { headers: { Authorization: `Bearer ${user.token}` } }
        );
        setMessages(data);
        socket.emit("join chat", selectedChat._id);
        setLoading(false);
      } catch (error) {
        toast.error("Failed to Load Messages");
      }
    };
    
    fetchMessages();
    selectedChatCompare = selectedChat;
  }, [selectedChat, user]);

  const sendMessage = async (event) => {
    if (event.key === "Enter" && newMessage) {
      try {
        const messageToSend = newMessage;
        setNewMessage("");

        const { data } = await axios.post(
          "http://localhost:5000/api/message",
          { content: messageToSend, chatId: selectedChat._id },
          { headers: { "Content-Type": "application/json", Authorization: `Bearer ${user.token}` } }
        );

        socket.emit("send Message", data);
        setMessages((prevMessages) => [...prevMessages, data]);
      } catch (error) {
        toast.error("Failed to send the message");
      }
    }
  };

  useEffect(() => {
    const messageListener = (newMessageRecieved) => {
      if (!selectedChatCompare || selectedChatCompare._id !== newMessageRecieved.chat._id) {
        // Give notification
      } else {
        setMessages((prevMessages) => [...prevMessages, newMessageRecieved]);
      }
    };

    socket.on("message recieved", messageListener);
    return () => socket.off("message recieved", messageListener);
  }, [selectedChatCompare]);

  return (
    <>
      {selectedChat ? (
        <>
          <Text fontSize={{ base: "28px", md: "30px" }} pb={3} px={2} w="100%" display="flex" justifyContent="space-between" gap={8} alignItems="center" color="white" fontWeight={700}>
            <Button style={{ backgroundColor: "darkblue", borderColor: "darkblue" }} onClick={() => setSelectedChat("")}> <FaArrowLeftLong /> </Button>
            {selectedChat?.isGroupChat ? selectedChat?.chatName?.toUpperCase() : getSender(user, selectedChat?.users)}
            {selectedChat.isGroupChat && <UpdateGroupChatModal fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} fetchMessages={fetchMessages} />}
            {!selectedChat.isGroupChat && <Button variant="primary" className="ms-2" onClick={() => setShowModal(true)}> Profile </Button>}
          </Text>
          {!selectedChat.isGroupChat && <UserProfileModal show={showModal} onClose={() => setShowModal(false)} user={getSenderFull(user, selectedChat.users)} />}
          <Box display="flex" flexDirection="column" justifyContent="flex-end" p={3} background="transparent" w="100%" h="100%" borderRadius="lg" overflowY="hidden">
            {loading ? (
              <Container fluid className="d-flex vh-100 justify-content-center align-items-center">
                <Spinner animation="border" role="status" size="large" />
              </Container>
            ) : (
              <div className="messages"> <ScrollAbleChat messages={messages} /> </div>
            )}
            <Form.Control type="text" onKeyDown={sendMessage} placeholder="Enter the message" style={{ backgroundColor: "#e0e0e0" }} onChange={(e) => setNewMessage(e.target.value)} value={newMessage} mt="6" required />
          </Box>
        </>
      ) : (
        <Box display="flex" alignItems="center" justifyContent="center" h="100%">
          <Text fontSize="3xl" className="text-white fs-1"> Click on a user to start chatting </Text>
        </Box>
      )}
    </>
  );
};

export default SingleChat;
