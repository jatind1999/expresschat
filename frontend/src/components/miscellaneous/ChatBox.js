import React, { useState, useEffect } from "react";
import {
    Box,
    FormControl,
    IconButton,
    Input,
    Spinner,
    Text,
    Toast,
    useToast,
} from "@chakra-ui/react";
import { ChatState } from "../../context/ChatContext";
import { ArrowBackIcon, ViewIcon } from "@chakra-ui/icons";
import { getSender, getSenderFull } from "../../config/ChatLogics";
import ProfileModal from "./ProfileModal";
import UpdateGroupChatModel from "./UpdateGroupChatModel";
import axios from "axios";
import Message from "./Message";
import { io } from "socket.io-client";
import Lottie from "lottie-react";
import TypingAnimation from "../../animations/typing.json";
const BACKEND_API = require("../../config/ApiServer");
const URL = BACKEND_API.URL;

const ENDPOINT = "https://expresschat.onrender.com:5500";
let socket;

const ChatBox = ({ fetchAgain, setFetchAgain }) => {
    const [loading, setLoading] = useState(false);
    const [newMessage, setNewMessage] = useState();
    const [messages, setMessages] = useState([]);

    const {
        user,
        selectedChat,
        setSelectedChat,
        notifications,
        setNotifications,
    } = ChatState();
    const [socketConnected, setSocketConnected] = useState(false);
    const [typing, setTyping] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const toast = useToast();

    useEffect(() => {
        socket = io(ENDPOINT);
        socket.emit("setup", user);
        socket.on("connected", () => {
            setSocketConnected(true);
            console.log("Socket State Changed");
        });
        socket.on("typing", () => setIsTyping(true));
        socket.on("stop typing", () => setIsTyping(false));
    }, []);

    useEffect(() => {
        socket.on("message received", (newMessage) => {
            if (!selectedChat || selectedChat._id !== newMessage.chat._id) {
                // send notification
                if (!notifications.includes(newMessage)) {
                    setNotifications([newMessage, ...notifications]);
                    fetchMessages();
                }
            } else {
                setMessages([...messages, newMessage]);
            }
        });
    });
    useEffect(() => {
        fetchMessages();
    }, [selectedChat]);

    const fetchMessages = async () => {
        if (!selectedChat) return;
        try {
            setLoading(true);
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };

            const { data } = await axios.get(
                `${URL}/api/message/${selectedChat._id}`,
                config
            );
            setMessages(data);
            socket.emit("join chat", selectedChat._id);
        } catch (error) {
            toast({
                title: "Unable to fetch chats",
                description: "Something went wrong.",
                duration: "3000",
                status: "error",
                isClosable: true,
            });
        } finally {
            setLoading(false);
        }
    };
    const typingHandler = (event) => {
        setNewMessage(event.target.value);

        if (!socketConnected) return;

        if (!typing) {
            setTyping(true);
            socket.emit("typing", selectedChat._id);
            console.log("Typing set to true");
        }

        // calculate delay. if typing handler waits for 3+ seconds, then stop typing.
        let lastTypingTime = new Date().getTime();
        let timerLength = 3000;

        setTimeout(() => {
            let timeNow = new Date().getTime();
            let timeDifference = timeNow - lastTypingTime;
            console.log(
                timeDifference,
                timerLength,
                typing,
                timeDifference >= timerLength
            );
            if (timeDifference >= timerLength && typing) {
                console.log("stop typing emitted to all users");
                socket.emit("stop typing", selectedChat._id);
                setTyping(false);
            } else {
                console.log("emit skipped");
            }
        }, timerLength);
    };
    const sendMessage = async (event) => {
        if (event.key === "Enter" && newMessage) {
            // if there is a message, then we call the api and save message.
            socket.emit("stop typing", selectedChat._id);
            const config = {
                headers: {
                    "Content-type": "application/json",
                    Authorization: `Bearer ${user.token}`,
                },
            };
            const message = {
                content: newMessage,
                chatId: selectedChat._id,
            };
            try {
                setLoading(true);
                setNewMessage("");
                const { data } = await axios.post(
                    `${URL}/api/message`,
                    message,
                    config
                );
                console.log(data);
                socket.emit("new message", data);
                setMessages([...messages, data]);
                setFetchAgain(!fetchAgain);
            } catch (error) {
                toast({
                    title: "Unable to send message",
                    description: error.message,
                    duration: "3000",
                    status: "error",
                    isClosable: true,
                });
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <Box
            display={{ base: selectedChat ? "flex" : "none", md: "flex" }}
            flexDirection="column"
            alignItems="center"
            background="#eee"
            height="100%"
            borderRadius="10px"
            width={{ base: "100%", md: "90%" }}
        >
            {selectedChat ? (
                <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    width="100%"
                    color="#FFF"
                    background="#04032d"
                    height="60px"
                    border="1px solid #eee"
                    padding="10px"
                    borderTopLeftRadius="10px"
                    borderTopRightRadius="10px"
                >
                    <IconButton
                        display={{ base: "block", md: "none" }}
                        icon={<ArrowBackIcon />}
                        onClick={() => setSelectedChat("")}
                    ></IconButton>
                    <Text fontSize="2xl">
                        {selectedChat.isGroupChat
                            ? selectedChat.chatName
                            : getSender(user, selectedChat.users)}
                    </Text>

                    {selectedChat.isGroupChat ? (
                        <UpdateGroupChatModel
                            fetchAgain={fetchAgain}
                            setFetchAgain={setFetchAgain}
                        />
                    ) : (
                        <ProfileModal
                            user={getSenderFull(user, selectedChat.users)}
                        ></ProfileModal>
                    )}
                </Box>
            ) : (
                <Box
                    display="flex"
                    justifyContent="cetner"
                    alignItems="center"
                    height="100%"
                    fontSize="3xl"
                >
                    Click on any chat to start chatting
                </Box>
            )}

            <Box
                display={selectedChat ? "flex" : "none"}
                flexDirection="column"
                gap="5px"
                background="#ccc"
                borderRadius="10px"
                width="99%"
                height="90%"
                className="outer"
                margin="5px 10px"
                justifyContent="center"
                alignItems="center"
            >
                {loading ? (
                    <Spinner size="xl" color="#04032d"></Spinner>
                ) : (
                    <Box
                        height="100%"
                        width="100%"
                        background="#04032d"
                        borderRadius="10px"
                        display="flex"
                        flexDirection="column"
                        justifyContent="space-between"
                        padding="10px"
                        className="inner"
                    >
                        <Box
                            height="90%"
                            width="100%"
                            mb={2}
                            overflowY="scroll"
                        >
                            {messages.map((message, index) => (
                                <Message
                                    key={index}
                                    message={message.content}
                                    sender={message.sender}
                                ></Message>
                            ))}
                        </Box>
                        {isTyping ? (
                            <Lottie
                                animationData={TypingAnimation}
                                style={{ width: "70px", height: "40px" }}
                            />
                        ) : (
                            <></>
                        )}
                        <FormControl>
                            <Input
                                type="text"
                                onKeyDown={(e) => sendMessage(e)}
                                background="#ececec"
                                placeholder="type to send message..."
                                onChange={(e) => typingHandler(e)}
                            ></Input>
                        </FormControl>
                    </Box>
                )}
            </Box>
        </Box>
    );
};

export default ChatBox;
