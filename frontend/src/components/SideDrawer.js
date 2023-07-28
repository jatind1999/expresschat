import React, { useState } from "react";
import {
    Box,
    Button,
    Menu,
    MenuList,
    Tooltip,
    Text,
    MenuButton,
    Avatar,
    MenuItem,
    MenuDivider,
    Drawer,
    DrawerBody,
    DrawerHeader,
    DrawerOverlay,
    DrawerContent,
    Input,
    useToast,
    Spinner,
} from "@chakra-ui/react";
import { useDisclosure } from "@chakra-ui/react";
import { SearchIcon, BellIcon, ChevronDownIcon } from "@chakra-ui/icons";
import { ChatState } from "../context/ChatContext";
import ProfileModal from "./miscellaneous/ProfileModal";
import { useHistory } from "react-router-dom";
import ChatLoading from "./ChatLoading";
import UserListItem from "./UserAvatar/UserListItem";
import axios from "axios";
import { getSender } from "../config/ChatLogics";
import NotificationBadge from "./miscellaneous/NotificationBadge";
const BACKEND_API = require("../config/ApiServer");

const SideDrawer = () => {
    // States
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingChat, setLoadingChat] = useState(false);
    const {
        user,
        setUser,
        selectedChat,
        setSelectedChat,
        chats,
        setChats,
        notifications,
        setNotifications,
    } = ChatState();
    const toast = useToast();

    const accessChat = async (userId) => {
        if (!userId) {
            toast({
                title: "No User Id!",
                description: "Cannot fetch chats without user id",
                duration: "3000",
                status: "error",
                isClosable: true,
            });
            return;
        }

        // make a call to create or access 1-on-1 chat.
        // the logged in user chats with user which is selected.

        const config = {
            headers: {
                "Content-type": "application/json",
                Authorization: `Bearer ${user.token}`,
            },
        };
        console.log(userId);
        try {
            setLoadingChat(true);
            const { data } = await axios.post(
                `${BACKEND_API}/api/chat`,
                { userId },
                config
            );
            // if the chat is not present in all fetched chats of the logged in user.
            // then append the new chat in all the chat list. and set chats again to new list.
            if (!chats.find((chat) => chat._id === data._id)) {
                setChats(data, ...chats);
            }

            // set selected chat as this chat.
            setSelectedChat(data);
            // close the drawer.

            onClose();
        } catch (error) {
            console.log(error);
        } finally {
            setLoadingChat(false);
        }
    };

    // Drawer handlers
    const { isOpen, onClose, onOpen } = useDisclosure();

    const history = useHistory();
    // Logout Handler
    const handleLogout = () => {
        localStorage.removeItem("userInfo");
        history.push("/");
    };

    // handle user search
    const handleSearch = async () => {
        if (!search) {
            toast({
                title: "Search Field is empty!",
                description: "Please enter atleast 1 character to search.",
                duration: "3000",
                status: "error",
                isClosable: true,
            });
            return;
        }

        try {
            setLoading(true);
            // If search field isnt empty, then generate a header for the request.

            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };

            // make a get request to the route, /api/user/
            const { data } = await axios.get(
                `${BACKEND_API}/api/user?search=${search}`,
                config
            );

            // set the search results state with the returned data.
            setSearchResult(data);
        } catch (error) {
            toast({
                title: "Cannot fetch users!",
                description: "Something went wrong, please try again",
                duration: "3000",
                status: "error",
                isClosable: true,
            });
        }
        setLoading(false);
    };

    return (
        <Box
            display="flex"
            border="5px solid #eee"
            background="#FFF"
            justifyContent="space-between"
            padding="10px"
        >
            <Button
                display="flex"
                justifyContent="center"
                alignItems="center"
                gap="5px"
                background="#04032d"
                color="#FFF"
                _hover={{ background: "#050444" }}
                onClick={onOpen}
            >
                <SearchIcon />
                <Tooltip
                    label="Click to search for users"
                    aria-label="A tooltip"
                    display={{ base: "none", md: "flex" }}
                >
                    Search User
                </Tooltip>
            </Button>

            <Text fontSize="2xl">Express</Text>

            <Box display="flex" gap="10px">
                <Menu>
                    <MenuButton position="relative">
                        {notifications.length ? (
                            <NotificationBadge
                                count={notifications.length}
                            ></NotificationBadge>
                        ) : (
                            <></>
                        )}
                        <BellIcon fontSize="2xl" color="#04032d" />
                    </MenuButton>
                    <MenuList padding={3}>
                        {!notifications.length ? (
                            <>No Notifications</>
                        ) : (
                            notifications.map((notif) => {
                                return (
                                    <MenuItem
                                        key={notif.chat._id}
                                        onClick={() => {
                                            setSelectedChat(notif.chat);
                                            setNotifications(
                                                notifications.filter(
                                                    (n) => n !== notif
                                                )
                                            );
                                        }}
                                    >
                                        {notif.chat.isGroupChat
                                            ? `New message from ${notif.chat.chatName}`
                                            : `New message from ${getSender(
                                                  user,
                                                  notif.chat.users
                                              )}`}
                                    </MenuItem>
                                );
                            })
                        )}
                    </MenuList>
                </Menu>

                <Menu>
                    <MenuButton
                        as={Button}
                        rightIcon={
                            <ChevronDownIcon fontSize="20px" color="#FFF" />
                        }
                        background="#04032d"
                        padding="0px 15px"
                        _hover={{ background: "#050444" }}
                    >
                        <Avatar
                            name={user.name}
                            src={user.pic}
                            size="sm"
                        ></Avatar>
                    </MenuButton>
                    <MenuList>
                        <ProfileModal user={user}>
                            <MenuItem>Profile</MenuItem>
                        </ProfileModal>
                        <MenuDivider></MenuDivider>
                        <MenuItem onClick={handleLogout}>Logout</MenuItem>
                    </MenuList>
                </Menu>
            </Box>
            <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
                <DrawerOverlay />
                <DrawerContent>
                    <DrawerHeader borderBottomWidth="1px">
                        Search Users
                    </DrawerHeader>
                    <DrawerBody padding="10px">
                        <Box display="flex" gap="6px" width="100%" mb="10px">
                            <Input
                                type="text"
                                value={search}
                                onChange={(e) => {
                                    setSearch(e.target.value);
                                }}
                            />
                            <Button onClick={handleSearch} isLoading={loading}>
                                Go
                            </Button>
                        </Box>
                        {loading ? (
                            <ChatLoading />
                        ) : (
                            searchResult?.map((user) => {
                                return (
                                    <UserListItem
                                        key={user._id}
                                        user={user}
                                        handleFunction={() =>
                                            accessChat(user._id)
                                        }
                                    />
                                );
                            })
                        )}

                        {loadingChat && (
                            <Spinner
                                thickness="4px"
                                speed="0.65s"
                                emptyColor="gray.200"
                                color="blue.500"
                                size="xl"
                            />
                        )}
                    </DrawerBody>
                </DrawerContent>
            </Drawer>
        </Box>
    );
};

export default SideDrawer;
