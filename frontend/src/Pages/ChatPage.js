import React, { useEffect, useState } from "react";
import { ChatState } from "../context/ChatContext";
import { Box } from "@chakra-ui/react";
import SideDrawer from "../components/SideDrawer";
import ChatBox from "../components/miscellaneous/ChatBox";
import MyChats from "../components/MyChats";
// import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

const ChatPage = () => {
    const { user, setUser } = ChatState();
    const [fetchAgain, setFetchAgain] = useState(false);
    useEffect(() => {
        setUser(JSON.parse(localStorage.getItem("userInfo")));
        setFetchAgain(!fetchAgain);
    }, []);
    // const history = useHistory();
    return (
        <div
            style={{ width: "100%", background: "#04032d", minHeight: "100vh" }}
        >
            {user && <SideDrawer />}
            <Box
                display="flex"
                justifyContent="space-between"
                p="10px"
                gap="10px"
                w="100%"
                h="91.5vh"
            >
                {user && <MyChats fetchAgain={fetchAgain} />}
                {user && (
                    <ChatBox
                        fetchAgain={fetchAgain}
                        setFetchAgain={setFetchAgain}
                    />
                )}
            </Box>
        </div>
    );
};
export default ChatPage;
