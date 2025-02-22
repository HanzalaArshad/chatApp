import { useState } from "react";
import { Modal, Button, Form, Spinner, Badge } from "react-bootstrap";
import UserList from "./UserList";
import UserBadgeItem from "@/userAvatar/userBadgeItem";
import UserListItem from "@/userAvatar/UserListItem";
import { chatState } from "@/context/chatProvider";
import axios from "axios";

const GroupChatModal = ({ children }) => {
  const [show, setShow] = useState(false);
  const [groupChatName, setGroupChatName] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);

  const { user, chats, setChats } = chatState();

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleGroup = (userToAdd) => {
    if (selectedUsers.includes(userToAdd)) {
      alert("User already added");
      return;
    }
    setSelectedUsers([...selectedUsers, userToAdd]);
  };

  const handleSearch = async (query) => {
    setSearch(query);
    if (!query) return;
    
    try {
      setLoading(true);
      const config = {
        headers: { Authorization: `Bearer ${user.token}` },
      };
      const { data } = await axios.get(`http://localhost:5000/api/user?search=${query}`, config);
  
      console.log("Search Query:", query);
      console.log("API Response:", data);
  
      setSearchResult(data);
      setLoading(false);
    } catch (error) {
      alert("Failed to Load the Search Results");
      setLoading(false);
    }
  };
  
  

  const handleDelete = (delUser) => {
    setSelectedUsers(selectedUsers.filter((sel) => sel._id !== delUser._id));
  };

  const handleSubmit = async () => {
    if (!groupChatName || !selectedUsers.length) {
      alert("Please fill all the fields");
      return;
    }
    try {
      const config = {
        headers: { Authorization: `Bearer ${user.token}` },
      };
      const { data } = await axios.post(
        `http://localhost:5000/api/chat/group`,
        { name: groupChatName, users: JSON.stringify(selectedUsers.map((u) => u._id)) },
        config
      );
      setChats([data, ...chats]);
      handleClose();
      alert("New Group Chat Created!");

    } catch (error) {
      alert("Failed to Create the Chat");
    }
  };

  return (
    <>
      <span onClick={handleShow}>{children}</span>
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Create Group Chat</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Control
              type="text"
              placeholder="Chat Name"
              onChange={(e) => setGroupChatName(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mt-2">
            <Form.Control
              type="text"
              placeholder="Add Users eg: John, Piyush, Jane"
              onChange={(e) => handleSearch(e.target.value)}
            />
          </Form.Group>
          <div className="d-flex flex-wrap mt-2">
            {selectedUsers.map((u) => (
              <UserBadgeItem key={u._id} user={u} handleFunction={() => handleDelete(u)} />
            ))}
          </div>
          {loading ? (
  <Spinner animation="border" className="mt-2" />
) : (
  searchResult?.slice(0, 4).map((user) => {
    return (
      <UserListItem 
        key={user._id} 
        user={user}  
        handleFunction={() => handleGroup(user)} 
      />
    );
  })
)}

        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>Close</Button>
          <Button variant="primary" onClick={handleSubmit}>Create Chat</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default GroupChatModal;
