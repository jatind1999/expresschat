import { Box } from "@chakra-ui/react";
import React from "react";
import { ChatState } from "../../context/ChatContext";

const Message = ({ message, sender }) => {
    const { user } = ChatState();

    return (
        <Box
            padding="4px 8px"
            background="white"
            border="2px solid white"
            borderRadius="10px"
            display="flex"
            marginLeft={sender === user._id ? "auto" : "0px"}
            borderTopRightRadius={sender === user._id ? "0px" : "10px"}
            borderTopLeftRadius={sender === user._id ? "10px" : "0px"}
            mb="3px"
            width="fit-content"
            position="relative"
            zIndex="2"
        >
            {message}
        </Box>
    );
};

export default Message;
