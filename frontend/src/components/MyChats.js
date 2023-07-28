import React, { useEffect, useState } from "react";
import { ChatState } from "../context/ChatContext";
import axios from "axios";
import { Box, useToast, Text, Button, Divider, Stack } from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";
import ChatLoading from "./ChatLoading";
import { getSender } from "../config/ChatLogics";
import GroupChatModal from "./miscellaneous/GroupChatModal";
const BACKEND_API = require("../config/ApiServer");

const MyChats = ({ fetchAgain }) => {
    const [loggedUser, setLoggedUser] = useState();
    const { chats, setChats, selectedChat, setSelectedChat, user } =
        ChatState();
    const toast = useToast();
    const fetchChats = async () => {
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };
            const { data } = await axios.get(`${BACKEND_API}/api/chat`, config);

            // set the data in chats state.
            setChats(data);
        } catch (error) {
            toast({
                title: "Cannot Fetch Chats",
                description: "Something went wrong :(",
                duration: "3000",
                status: "error",
                isClosable: true,
            });
        }
    };

    useEffect(() => {
        setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
        fetchChats();
    }, [fetchAgain]);

    return (
        <Box
            display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
            flexDirection="column"
            alignItems="center"
            background="#eee"
            height="100%"
            borderRadius="10px"
            width={{ base: "100%", md: "30%" }}
        >
            <Box
                display="flex"
                justifyContent="space-between"
                width="100%"
                padding="10px"
            >
                <Text fontSize="2xl">My Chats</Text>
                <GroupChatModal>
                    <Button
                        variant="outline"
                        background="#ddd"
                        _hover={{ background: "#04032d", color: "#FFF" }}
                        display="flex"
                        gap="10px"
                    >
                        Create a group chat
                        <AddIcon />
                    </Button>
                </GroupChatModal>
            </Box>
            <Divider />
            <Divider />

            {chats.length && loggedUser ? (
                <Stack overflowY="scroll" width="100%" padding="10px">
                    {chats.map((chat) => {
                        console.log(
                            "Latest Message: ",
                            chat.latestMessage.sender.name
                        );
                        return (
                            <Box
                                display="flex"
                                flexDirection="column"
                                padding="20px 10px"
                                gap="3px"
                                background="#dfdfdf"
                                borderRadius="10px"
                                width="100%"
                                cursor="pointer"
                                boxShadow="0px 0px 2px 1px rgba(0,0,0,0.1)"
                                _hover={{
                                    background: "#030221",
                                    color: "#ddd",
                                }}
                                key={chat._id}
                                onClick={() => setSelectedChat(chat)}
                            >
                                {chat.isGroupChat
                                    ? chat.chatName
                                    : getSender(loggedUser, chat.users)}
                                <Text>
                                    {user.name ===
                                    chat.latestMessage.sender.name ? (
                                        <b>You: </b>
                                    ) : (
                                        <b>
                                            {chat.latestMessage.sender.name}:{" "}
                                        </b>
                                    )}

                                    {chat.latestMessage.content.length >= 50
                                        ? chat.latestMessage.content.substring(
                                              0,
                                              50
                                          ) + "...."
                                        : chat.latestMessage.content}
                                </Text>
                            </Box>
                        );
                    })}
                </Stack>
            ) : (
                <ChatLoading />
            )}
        </Box>
    );
};

export default MyChats;
