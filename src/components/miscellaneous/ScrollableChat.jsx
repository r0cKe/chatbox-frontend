import { Avatar, Tooltip } from "@chakra-ui/react";
import React from "react";
import { useRef } from "react";
import { useEffect } from "react";
import {
  isLastMessage,
  isSameSender,
  isSameSenderMargin,
  isSameUser,
} from "../../config/ChatLogics";
import { ChatState } from "../context/chatProvider";

const ScrollableChat = ({ messages }) => {
  const { user } = ChatState();

  const messageEndRef = useRef(null);

  const scrollToBottom = () => {
    messageEndRef.current?.scrollIntoView();
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="scroll">
      {messages &&
        messages.map((m, i) => (
          <div className="d-flex ps-3 pe-3" style={{ zIndex: 100 }} key={m._id}>
            {(isSameSender(messages, m, i, user._id) ||
              isLastMessage(messages, i, user._id)) && (
              <Tooltip label={m.sender.name} placement="bottom-start" hasArrow>
                <Avatar
                  className="message-avatar"
                  zIndex={100}
                  mt="7px"
                  mr={1}
                  size="sm"
                  cursor="pointer"
                  name={m.sender.name}
                  src={m.sender.pic}
                />
              </Tooltip>
            )}
            <span
              className="message-box"
              style={{
                padding: "6px",
                backgroundColor: `${
                  m.sender._id === user._id ? "#BEE3F8" : "#B9F5D0"
                }`,
                borderRadius: "6px",
                marginLeft: isSameSenderMargin(messages, m, i, user._id),
                marginTop: isSameUser(messages, m, i, user._id) ? 3 : 10,
                borderRadius: "20px",
                padding: "5px 15px",
                maxWidth: "75%",
              }}
            >
              {m.content}
            </span>
            <div ref={messageEndRef} />
          </div>
        ))}
    </div>
  );
};

export default ScrollableChat;
