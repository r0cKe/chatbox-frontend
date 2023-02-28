import { Box, Button, Stack, useToast, Text } from "@chakra-ui/react";
import axios from "axios";
import React from "react";
import { useEffect } from "react";
import { getSender } from "../../config/ChatLogics";
import { ChatState } from "../context/chatProvider";
import ChatLoading from "./ChatLoading";
import GroupChatModal from "./GroupChatModal";

const MyChats = ({ fetchAgain }) => {
  const { user, selectedChat, setSelectedChat, chats, setChats } = ChatState();

  const toast = useToast();

  useEffect(() => {
    fetchChats();
  }, [fetchAgain]);

  const fetchChats = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get(
        "https://chatbox-backend.onrender.com/api/chat",
        config
      );
      setChats(data);
    } catch (error) {
      toast({
        title: "Error loading the chats",
        description: "Failed to load the chats",
        status: "error",
        duration: 4000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  return (
    <Box
      className="my-chat-box"
      display={{
        base: selectedChat ? "none" : "flex",
        md: "flex",
        sm: selectedChat ? "none" : "flex",
      }}
      flexDir="column"
      alignItems="center"
      p={3}
      bg="white"
      w={{ base: "100%", md: "31%" }}
      borderRadius="lg"
      borderWidth="1px"
    >
      <Box
        className="mychat-btn-box"
        pb={3}
        px={3}
        fontSize={{ base: "28px", md: "25px", sm: "30px" }}
        fontFamily="Work Sans"
        display="flex"
        flexDir={{ base: "column", sm: "row", md: "column", lg: "row" }}
        w="100%"
        justifyContent="space-between"
        alignItems="center"
      >
        My Chats
        <GroupChatModal>
          <Button
            className="mt-2"
            display="flex"
            fontSize={{ base: "17px" }}
            rightIcon={<i className="fa-solid fa-plus"></i>}
          >
            New Group Chat
          </Button>
        </GroupChatModal>
      </Box>
      <Box
        display="flex"
        flexDir="column"
        p={3}
        bg="#F8F8F8"
        w="100%"
        h="100%"
        borderRadius="lg"
        overflow="hidden"
      >
        {chats ? (
          <Stack overflowY="scroll">
            {chats.map((chat) => {
              return (
                <Box
                  onClick={() => setSelectedChat(chat)}
                  cursor="pointer"
                  bg={selectedChat === chat ? "#38B2AC" : "#E8E8E8"}
                  color={selectedChat === chat ? "white" : "black"}
                  px={3}
                  py={2}
                  borderRadius="lg"
                  key={chat._id}
                >
                  <Text>
                    {!chat.isGroupChat
                      ? getSender(user, chat.users)
                      : chat.chatName}
                  </Text>
                </Box>
              );
            })}
          </Stack>
        ) : (
          <ChatLoading />
        )}
      </Box>
    </Box>
  );
};

export default MyChats;
