import { chatState } from "@/context/chatProvider";
import UserBadgeItem from "@/userAvatar/userBadgeItem";
import React, { useState } from "react";
import { Modal, Button, Form, ListGroup, Spinner } from "react-bootstrap";
import { toast } from "react-toastify";
import UserList from "./UserList";
import UserListItem from "@/userAvatar/UserListItem";
import { Box } from "@chakra-ui/react";
import axios from "axios";
import { IoSettingsSharp } from "react-icons/io5";

const UpdateGroupChatModal = ({ fetchAgain, setFetchAgain,fetchMessages }) => {
  const [show, setShow] = useState(false);
  const [groupChatName, setGroupChatName] = useState("");
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [renameLoading, setRenameLoading] = useState(false);

  const { user, selectedChat, setSelectedChat } = chatState();

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleRemove = async (user1) => {
    if (selectedChat.groupAdmin._id !== user._id && user1._id !== user._id) {
      toast.error("Only admins can remove members!");
      return;
    }

    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.put(
        "http://localhost:5000/api/chat/removegroup",
        { chatId: selectedChat._id, userId: user1._id },
        config
      );

      user1._id === user._id ? setSelectedChat(null) : setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      fetchMessages()
      setLoading(false);
    } catch (error) {
      toast.error(error.response.data.message);
      setLoading(false);
    }
  };

  const handleAddUser = async (user1) => {
    if (selectedChat.users.find((u) => u._id === user1._id)) {
      toast.warning("User already exists!");
      return;
    }
    if (selectedChat.groupAdmin._id !== user._id) {
      toast.warning("Only admins can add members!");
      return;
    }

    try {
      setLoading(true);

      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.put(
        "http://localhost:5000/api/chat/addgroup",
        { chatId: selectedChat._id, userId: user1._id },
        config
      );

      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setLoading(false);
    } catch (error) {
      toast.error(error.response.data.message);
      setLoading(false);
    }
  };

  const handleRename = async () => {
    if (!groupChatName) return;

    try {
      setRenameLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.put(
        "http://localhost:5000/api/chat/rename",
        { chatId: selectedChat._id, chatName: groupChatName },
        config
      );

      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setRenameLoading(false);
    } catch (error) {
      toast.error(error.response.data.message);
      setRenameLoading(false);
    }

    setGroupChatName("");
  };

  const handleSearch = async (query) => {
    setSearch(query);
    if (!query) return;

    try {
      setLoading(true);
      const config = {
        headers: { Authorization: `Bearer ${user.token}` },
      };
      const { data } = await axios.get(
        `http://localhost:5000/api/user?search=${query}`,
        config
      );

      setSearchResult(data);
      setLoading(false);
    } catch (error) {
      toast.error("Failed to load the search results");
      setLoading(false);
    }
  };

  return (
    <>
      <Button variant="warning" onClick={handleShow}>
      <IoSettingsSharp />
      </Button>

      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>{selectedChat.chatName}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h1 className="text-center mb-3 text-success">Members</h1>

          <Box horizontal>
            {selectedChat.users.map((u) => (
              <UserBadgeItem
                key={u._id}
                user={u}
                handleFunction={() => handleRemove(u)}
              />
            ))}
          </Box>
          <Form>
            <Form.Label className="mt-3">
              <b>Chat Name</b>
            </Form.Label>

            <Form.Group className="mt-1 d-flex">
              <Form.Control
                type="text"
                placeholder="Enter new chat name"
                value={groupChatName}
                className="shadow-lg"
                onChange={(e) => setGroupChatName(e.target.value)}
              />
              <Button variant="success" disabled={renameLoading} onClick={handleRename}>
                {renameLoading ? <Spinner size="sm" animation="border" /> : "Update"}
              </Button>
            </Form.Group>

            <Form.Group className="mt-3">
              <Form.Label>Add User</Form.Label>
              <Form.Control
                type="text"
                placeholder="Add Users"
                className="shadow-lg"
                onChange={(e) => handleSearch(e.target.value)}
              />
            </Form.Group>
          </Form>

          {loading ? (
            <Spinner size="lg" />
          ) : (
            searchResult?.map((user) => (
              <UserListItem
                user={user}
                key={user._id}
                handleFunction={() => handleAddUser(user)}
              />
            ))
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={() => handleRemove(user)}>
            Leave Group
          </Button>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default UpdateGroupChatModal;
