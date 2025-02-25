import React, { useState } from "react";
import {
  Box,
  Button,
  MenuItem,
  Text,
  MenuRoot,
  MenuTrigger,
  MenuContent,
  Avatar,
  Input,
  Image,
} from "@chakra-ui/react";
import {
  DrawerActionTrigger,
  DrawerBackdrop,
  DrawerBody,
  DrawerCloseTrigger,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerRoot,
} from "@/components/ui/drawer"; // Assuming your drawer components are custom
import { IoSearchSharp } from "react-icons/io5";
import { IoIosNotifications } from "react-icons/io";
import { Dropdown, OverlayTrigger, Spinner, Tooltip } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import ProfileModal from "./ProfileModal";
import { chatState } from "@/context/chatProvider";
import { toast } from "react-toastify";
import axios from "axios";
import ChatLoading from "./ChatLoading";
import UserList from "./UserList";

const SideDrawer = () => {
  const { user,setSelectedChat,chats,setChats,notification,setNotification } = chatState();
  const [showProfile, setShowProfile] = useState(false); // State to control ProfileModal
  const [drawerState, setDrawerState] = useState({ open: false }); // State to control Drawer open/close
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);



  const [searchResult, setSearchResult] = useState([]);

  const navigate = useNavigate();

  const logouthandler = () => {
    localStorage.removeItem("userInfo");
    navigate("/");
  };

  const handleSearch = async () => {
    if (!search) {
      toast.warning("Please enter a search term");
      return;
    }

    try {
      setLoading(true);
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const { data } = await axios.get(
        `https://chatapp-production-31d4.up.railway.app/api/user?search=${search}`,
        config
      );

      setSearchResult(data);
      setSearch(""); // Clear input after search
    } catch (error) {
      toast.error("Error fetching users");
    } finally {
      setLoading(false);
    }
  };

  const accessChat=async(userId)=>{
      try {
        setLoadingChat(true)
        const config = { headers: { 
           
          "content-type":"application/json",
          Authorization: `Bearer ${user.token}` }
         };

         const {data}=await axios.post( `https://chatapp-production-31d4.up.railway.app/api/chat`,{userId},config)

         if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);
         setSelectedChat(data)  
         setLoadingChat(false)
         setDrawerState({ open: false });
          
      } catch (error) {
         toast.error(error.message)
      }
  }
  

  return (
    <>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        bg="black"
        
        p="5px 10px"
        borderWidth="1px"
        position="relative"
      >
        {/* Search Button */}
        <OverlayTrigger
          placement="bottom"
          overlay={<Tooltip id="tooltip-search">Search Users to Chat</Tooltip>}
        >
          <Button
            variant="light"

            className="border-0 d-flex align-items-center  "
            onClick={() => setDrawerState((prevState) => ({ open: !prevState.open }))} // Toggle Drawer state correctly
          >
            <IoSearchSharp size={20} className="me-2 text-white" />
            <span className="d-none d-md-inline text-white">Search Users</span>
          </Button>
        </OverlayTrigger>

        {/* App Name */}
        <Text fontSize="2xl" className="mt-3 text-white" fontFamily="work sans" fontWeight="bold">
          Connectify
        </Text>

        {/* Notifications & Profile */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <Button size="lg" variant="transparent" style={{ color: "white" }}>
                <IoIosNotifications />
                {/* Notification Badge */}
                {notification.length > 0 && (
                  <Box
                    position="absolute"
                    top="0"
                    right="0"
                    bg="red.500"
                    borderRadius="full"
                    width="18px"
                    height="18px"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    color="white"
                    fontSize="12px"
                  >
                    {notification.length}
                  </Box>
                )}
              </Button> 

          {/* User Profile */}
          <Dropdown align="end">
      <Dropdown.Toggle as={Button} variant="transparent" className="d-flex align-items-center border-0">
        <img
          src={user.pic}
          alt={user.name}
          width="35"
          height="35"
          style={{ objectFit: "cover" }}
        />
      </Dropdown.Toggle>

      <Dropdown.Menu>
        <Dropdown.Item onClick={() => setShowProfile(true)}>Profile</Dropdown.Item>
        <Dropdown.Item onClick={logouthandler} className="text-danger">Logout</Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
        </div>

        {/* Profile Modal - Always Rendered but Controlled by State */}
        {showProfile && <ProfileModal user={user} onClose={() => setShowProfile(false)} />}
      </Box>

      {/* Drawer - Controlled by `drawerState` */}
      <DrawerRoot
        placement="left"
        open={drawerState.open}
        onOpenChange={setDrawerState} // This directly updates the boolean state
        onClick={() => setDrawerState({ open: false })} // Close Drawer when clicked outside
      >
        <DrawerBackdrop />
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle className="text-white">Search Users</DrawerTitle>
          </DrawerHeader>

          <DrawerBody>
            <Box display="flex" pb={2}>
              <Input
                placeholder="Search by Name or Email"
                mr={2}
                value={search}
                color="white"
                onChange={(e) => setSearch(e.target.value)}
              />
              <Button onClick={handleSearch} className="rounded bg-success text-white">
                Search
              </Button>
            </Box>

            {loading ? (
        <ChatLoading />
      ) : (
        searchResult.length > 0 ? (
          searchResult.map((user) => (
            <UserList key={user._id} user={user} handleFunction={()=>accessChat(user._id)}/>

          // <Box
          //   key={user._id}
          //   display="flex"
          //   alignItems="center"
          //   p={2}
          //   borderBottom="1px solid lightgray"
          //   borderRadius="md"
          //   cursor="pointer"
          //   background="white"
          //   marginTop="10px"
          //   _hover={{ bg: "gray.200" }}
          // >
          //   <Image
          //     src={user.pic}
          //     alt={user.name}
          //     boxSize="40px"
          //     borderRadius="full"
          //     mr={3}
          //   />
          //   <Box className="bg-white text-black w-100 rounded ">
          //     <Text fontWeight="bold" className="px-3 mt-2" >{user.name}</Text>
          //     <Text fontSize="sm" className="px-1" color="gray.500">
          //       {user.email}
          //     </Text>
          //   </Box>
          // </Box>
          ))
        ) : (
          <Text className="text-white">No users found.</Text>
        )
      )}
        {loadingChat && <Spinner className="d-flex text-white flex-end ml-auto"/>}

          </DrawerBody>

          <DrawerFooter>
            {/* Close Button */}
            <Button onClick={() => setDrawerState({ open: false })} >Close</Button>
          </DrawerFooter>
        </DrawerContent>
      </DrawerRoot>
    </>
  );
};

export default SideDrawer;
