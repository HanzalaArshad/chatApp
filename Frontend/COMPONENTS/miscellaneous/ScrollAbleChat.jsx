import { isLastMessage, isSameSender, isSameSenderMargin, isSameUser } from '@/config/ChatLogics';
import { chatState } from '@/context/chatProvider';
import React from 'react';
import { Tooltip, OverlayTrigger, Image } from 'react-bootstrap';
import ScrollableFeed from 'react-scrollable-feed';

const ScrollAbleChat = ({ messages }) => {
  const { user } = chatState();

  return (
    <ScrollableFeed style={{ paddingBottom: "60px" }}> {/* Added padding-bottom */}
      {messages &&
        messages.map((m, i) => (
          <div
            className="d-flex mb-2" // Added margin-bottom for spacing
            key={m._id}
            style={{
              justifyContent: m.sender._id === user._id ? "flex-end" : "flex-start",
              alignItems: "center",
              display: "flex",
            }}
          >
            {(isSameSender(messages, m, i, user._id) || isLastMessage(messages, i, user._id)) && (
              <OverlayTrigger
                placement="top"
                overlay={
                  <Tooltip id={`tooltip-${m._id}`}>
                    <div className="text-center">
                      <small>{m.sender.name}</small>
                    </div>
                  </Tooltip>
                }
              >
                <span className="tooltip-trigger" style={{ flexShrink: 0, marginRight: "8px" }}>
                  <img
                    src={m.sender.pic}
                    alt="User"
                    className="rounded-circle img-fluid"
                    style={{
                      width: "30px",
                      height: "30px",
                      objectFit: "cover",
                      borderRadius: "50%",
                    }}
                  />
                </span>
              </OverlayTrigger>
            )}

            <span
              style={{
                backgroundColor: m.sender._id === user._id ? "#BEE3F8" : "#B9F5D0",
                borderRadius: "20px",
                padding: "8px 15px",
                maxWidth: "75%",
                display: "inline-block",
                marginLeft: isSameSenderMargin(messages, m, i, user._id),
                marginTop: isSameUser(messages, m, i, user._id) ? 5 : 12, // Increased marginTop for better spacing
              }}
            >
              {m.content}
            </span>
          </div>
        ))}
    </ScrollableFeed>
  );
};

export default ScrollAbleChat;
