import React, { useState } from "react";
import {
    Button,
    Modal,
    ModalBody,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalFooter,
    useDisclosure,
    useToast,
    FormControl,
    Input,
    Box,
    Spinner,
} from "@chakra-ui/react";
import { ChatState } from "../../context/ChatContext";
import axios from "axios";
import UserListItem from "../UserAvatar/UserListItem";
import UserBadgeItem from "../UserAvatar/UserBadgeItem";
const BACKEND_API = require("../../config/ApiServer");
const URL = BACKEND_API.URL;

const GroupChatModal = ({ children }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    // Defining states.
    const [groupName, setGroupName] = useState("");
    const [groupMembers, setGroupMembers] = useState([]);
    const [search, setSearch] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(false);

    // toast setup.
    const toast = useToast();

    // fetching context states.
    const { chats, setChats, user } = ChatState();

    // handling search
    const handleSearch = async (searchQuery) => {
        // if search query empty, show a toast.
        if (!searchQuery) {
            return;
        }

        try {
            setLoading(true);
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };
            const { data } = await axios.get(
                `${URL}/api/user?search=${searchQuery}`,
                config
            );

            setSearchResults(data);
            setLoading(false);
        } catch (error) {
            toast({
                title: "Cannot search for users",
                description: "Something went wrong :(",
                duration: "3000",
                status: "error",
                isClosable: true,
            });
        }
    };

    // handle submit
    const handleSubmit = async () => {
        if (!groupMembers || !groupName) {
            console.log("Error Occured");
            toast({
                title: "Cannot create group",
                description: "Please fill all the fields.",
                duration: "3000",
                status: "error",
                isClosable: true,
            });
            return;
        }

        try {
            setLoading(true);
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };

            const { data } = await axios.post(
                `${URL}/api/chat/group`,
                {
                    groupName: groupName,
                    users: JSON.stringify(groupMembers.map((user) => user._id)),
                },
                config
            );
            console.log("Data fetched");
            setChats([data, ...chats]);
            setLoading(false);
            setGroupMembers([]);
            setGroupName("");
            setSearchResults([]);
            onClose();
            toast({
                title: "Success",
                description: "New Group Chat created!",
                duration: "3000",
                status: "success",
                isClosable: true,
            });
        } catch (error) {
            toast({
                title: "Cannot create group",
                description: "Something went wrong :(",
                duration: "3000",
                status: "error",
                isClosable: true,
            });
        }
    };

    // handle removing user form group list.
    const deleteUserFromGroup = (selectedUser) => {
        setGroupMembers(
            groupMembers.filter(
                (groupUser) => selectedUser._id !== groupUser._id
            )
        );
    };

    // handle adding user to group users.
    const addToGroup = (user) => {
        if (groupMembers.includes(user)) {
            toast({
                title: "User already added!",
                description: "Cannot add user since it already is added.",
                duration: "3000",
                status: "error",
                isClosable: true,
            });
            return;
        }
        console.log(groupMembers);

        setGroupMembers([...groupMembers, user]);
    };
    return (
        <>
            <span onClick={onOpen}>{children}</span>

            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Craete Group Chat</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <FormControl>
                            <Input
                                type="text"
                                placeholder="Chat name"
                                mb={2}
                                value={groupName}
                                onChange={(e) => setGroupName(e.target.value)}
                            />
                        </FormControl>
                        <FormControl>
                            <Input
                                type="text"
                                placeholder="Add users Ex: John, Jatin etc."
                                onChange={(e) => {
                                    handleSearch(e.target.value);
                                }}
                            />
                        </FormControl>
                        {groupMembers.length > 0 ? (
                            <Box display="flex" gap="3px">
                                {groupMembers.map((user) => {
                                    return (
                                        <UserBadgeItem
                                            key={user._id}
                                            userName={user.name}
                                            handleDelete={() =>
                                                deleteUserFromGroup(user)
                                            }
                                        />
                                    );
                                })}
                            </Box>
                        ) : (
                            <Box
                                border="1px solid #c53030"
                                background="#ffa0a0"
                                display="inline-block"
                                mt={2}
                                padding={1}
                                borderRadius="5px"
                            >
                                No users added yet.
                            </Box>
                        )}
                        {loading ? (
                            <Spinner mt={2} alignContent="center" />
                        ) : (
                            <Box
                                display="flex"
                                flexDirection="column"
                                gap="4px"
                                mt={2}
                            >
                                {searchResults?.slice(0, 4).map((user) => {
                                    return (
                                        <UserListItem
                                            key={user._id}
                                            user={user}
                                            handleFunction={() =>
                                                addToGroup(user)
                                            }
                                        />
                                    );
                                })}
                            </Box>
                        )}
                    </ModalBody>

                    <ModalFooter>
                        <Button
                            colorScheme="blue"
                            mr={3}
                            onClick={handleSubmit}
                            isLoading={loading}
                        >
                            Create Chat
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
};

export default GroupChatModal;
