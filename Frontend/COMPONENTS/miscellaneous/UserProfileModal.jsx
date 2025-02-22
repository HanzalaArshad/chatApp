import React from "react";
import { Modal, Button } from "react-bootstrap";

const UserProfileModal = ({ show, onClose, user }) => {
  if (!user) return null;

  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>{user.name}'s Profile</Modal.Title>
      </Modal.Header>
      <Modal.Body className="text-center">
      <img
  src={user.pic || "https://via.placeholder.com/150"}
  alt={user.name}
  className="mb-3 shadow"
  width="120"
  height="120"
  style={{
    border: "3px solidrgb(148, 206, 110)",
    borderRadius: "50%", // Ensures the image is perfectly round
    objectFit: "cover",  // Prevents distortion by cropping extra parts
    width: "120px",      // Explicit width
    height: "120px",     // Explicit height
    display: "block"     // Avoids unwanted spacing
  }}
/>
  

        <h4 className="fw-bold">{user.name}</h4>
        <p className="text-muted">{user.email}</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default UserProfileModal;
