import React from "react";
import { ChatState } from "../context/chatProvider";
import { Box } from "@chakra-ui/react";
import SingleChat from "./SingleChat";

const ChatArea = ({ fetchAgain, setFetchAgain }) => {
  const { selectedChat } = ChatState();
  return (
    <Box
      className="single-chat-box"
      display={{
        base: selectedChat ? "flex" : "none",
        md: "flex",
        sm: selectedChat ? "flex" : "none",
      }}
      alignItems="center"
      flexDir="column"
      p={3}
      bg="white"
      w={{ base: "100%", md: "68%" }}
      borderRadius="lg"
      borderWidth="1px"
    >
      <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
    </Box>
  );
};

export default ChatArea;
