import React from "react";
import { Modal, Button } from "react-bootstrap";

const ProfileModal = ({ user, onClose }) => {
  return (
    <Modal
      show={true}
      onHide={onClose}
      centered
      className="custom-modal"
      style={{ borderRadius: "15px", boxShadow: "0 5px 15px rgba(0, 0, 0, 0.1)" }}
    >
      <Modal.Header closeButton className="bg-success text-white" style={{ borderTopLeftRadius: "0px", borderTopRightRadius: "0px" }}>
        <Modal.Title>User Profile</Modal.Title>
      </Modal.Header>
      <Modal.Body className="text-center" style={{ padding: "2rem" }}>
        <div
          className="d-flex justify-content-center align-items-center"
          style={{ flexDirection: "column" }}
        >
          <img
            src={user.pic}
            alt={user.name}
            style={{
              borderRadius: "50%",
              width: "120px",
              height: "120px",
              border: "5px solid #f0f0f0", // Adding a light border for visual appeal
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)", // Soft shadow around the image
            }}
            className="img-fluid"
          />
          <h3 className="mt-3" style={{ color: "#333", fontWeight: "bold" }}>
            {user.name}
          </h3>
          <p className="text-muted" style={{ fontSize: "14px" }}>
            {user.email}
          </p>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="outline-primary"
          onClick={onClose}
          style={{
            borderRadius: "5px",
            fontWeight: "bold",
            borderColor: "#007bff", // Primary button border color
          }}
          className="w-100"
        >
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ProfileModal;
  