import {
    useToast,
    Button,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalBody,
    ModalCloseButton,
    ModalHeader,
    ModalFooter,
    useDisclosure,
    IconButton,
    Box,
    FormControl,
    Input,
    Spinner,
} from "@chakra-ui/react";
import { ViewIcon } from "@chakra-ui/icons";
import React, { useState } from "react";
import { ChatState } from "../../context/ChatContext";
import UserBadgeItem from "../UserAvatar/UserBadgeItem";
import axios from "axios";
import UserListItem from "../UserAvatar/UserListItem";

const UpdateGroupChatModel = ({ fetchAgain, setFetchAgain }) => {
    // states
    const [groupChatName, setGroupChatName] = useState("");
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [renameLoading, setRenameLoading] = useState(false);
    const { user, selectedChat, setSelectedChat } = ChatState();
    const toast = useToast();
    const { isOpen, onOpen, onClose } = useDisclosure();

    // callbacks
    const handleRemove = async (selectedGroupUser, leavingGroup) => {
        // check if the logged user is admin or not
        if (
            !leavingGroup &&
            user._id !== selectedChat.groupAdmin._id &&
            selectedGroupUser._id !== user._id
        ) {
            toast({
                title: "Cannot remove user from group.",
                description: "Only Admins can remove user from group.",
                duration: "3000",
                status: "error",
                isClosable: true,
            });
            return;
        }

        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };

            const { data } = await axios.put(
                "/api/chat/groupremove",
                {
                    groupId: selectedChat._id,
                    userId: selectedGroupUser._id,
                },
                config
            );

            selectedGroupUser._id === user._id
                ? setSelectedChat("")
                : setSelectedChat(data);
            setFetchAgain(!fetchAgain);
        } catch (error) {
            toast({
                title: "Cant remove user.",
                description: "Cannot remove user from group.",
                duration: "3000",
                status: "error",
                isClosable: true,
            });
        }
    };

    const handleUpdate = async () => {
        if (!groupChatName) {
            toast({
                title: "Cant rename group.",
                description: "Empty group name. Please fill in and try again.",
                duration: "3000",
                status: "error",
                isClosable: true,
            });
            return;
        }

        try {
            setRenameLoading(true);

            // make api call to change the group name.
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };
            const { data } = await axios.put(
                "/api/chat/rename",
                {
                    groupName: groupChatName,
                    groupChatId: selectedChat._id,
                },
                config
            );

            setSelectedChat(data);
            setFetchAgain(!fetchAgain);
            setGroupChatName("");
            setRenameLoading(false);
            onClose();
            // Success Message
            toast({
                title: "Group name updated.",
                description: "Group name has been successfully changed.",
                duration: "3000",
                status: "success",
                isClosable: true,
            });
        } catch (error) {
            toast({
                title: "Cant rename group.",
                description: "Something went wrong.",
                duration: "3000",
                status: "error",
                isClosable: true,
            });
            setRenameLoading(false);
        }
    };

    const addUserToGroup = async (selectedUser) => {
        if (selectedChat.users.find((user) => user._id === selectedUser._id)) {
            toast({
                title: "User already added.",
                description: "User is already added in the group list.",
                duration: "3000",
                status: "warning",
                isClosable: true,
            });
            return;
        }

        // check if the logged in user is admin or not.
        if (user._id !== selectedChat.groupAdmin._id) {
            toast({
                title: "Cannot add user",
                description: "Only Admins can add users.",
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

            const { data } = await axios.put(
                "/api/chat/groupAdd",
                {
                    groupId: selectedChat._id,
                    userId: selectedUser._id,
                },
                config
            );

            setLoading(false);
            setSelectedChat(data);
            setSearch("");
            setSearchResults([]);
            setFetchAgain(!fetchAgain);
            toast({
                title: "User added to group list",
                description: "User successfully added to group list.",
                duration: "3000",
                status: "success",
                isClosable: true,
            });
        } catch (error) {
            toast({
                title: "Cannot add user",
                description: "Something went wrong :(",
                duration: "3000",
                status: "error",
                isClosable: true,
            });
            setLoading(false);
        }
    };

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
                `/api/user?search=${searchQuery}`,
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
    return (
        <>
            <IconButton
                aria-label="Click to view"
                onClick={onOpen}
                icon={<ViewIcon />}
            />

            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>{selectedChat.chatName}</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Box display="flex" gap="3px" mb={2}>
                            {selectedChat.users.map((u) => (
                                <UserBadgeItem
                                    key={u._id}
                                    userName={u.name}
                                    handleDelete={() => handleRemove(u, false)}
                                ></UserBadgeItem>
                            ))}
                        </Box>
                        <FormControl display="flex" gap="3px" mb={2}>
                            <Input
                                type="text"
                                value={groupChatName}
                                onChange={(e) =>
                                    setGroupChatName(e.target.value)
                                }
                                placeholder="Type and click to change group name."
                            />
                            <Button
                                variant="outline"
                                colorScheme="blue"
                                onClick={handleUpdate}
                                isLoading={renameLoading}
                            >
                                Update
                            </Button>
                        </FormControl>

                        <FormControl>
                            <Input
                                type="text"
                                onChange={(e) => handleSearch(e.target.value)}
                                placeholder="Search to add users to this group."
                                mb={2}
                            />
                        </FormControl>

                        {loading ? (
                            <Spinner />
                        ) : (
                            searchResults?.map((u) => {
                                return (
                                    <UserListItem
                                        key={u._id}
                                        user={u}
                                        handleFunction={() => addUserToGroup(u)}
                                    />
                                );
                            })
                        )}
                    </ModalBody>

                    <ModalFooter>
                        <Button
                            colorScheme="red"
                            mr={3}
                            onClick={() => handleRemove(user, true)}
                        >
                            Leave the group
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
};

export default UpdateGroupChatModel;
