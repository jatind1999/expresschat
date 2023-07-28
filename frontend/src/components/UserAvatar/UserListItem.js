import { Avatar, Box, Text } from "@chakra-ui/react";
import React from "react";

const UserListItem = ({ user, handleFunction }) => {
    return (
        <Box
            onClick={handleFunction}
            display="flex"
            gap="20px"
            padding="10px 0px"
            background="#ccc"
            justifyContent="center"
            alignItems="center"
            borderRadius="10px"
            transition="all 0.2s"
            _hover={{
                background: "#04032d",
                color: "#FFF",
                boxShadow: "0px 0px 5px 5px rgba(0,0,0,0.1)",
                transition: "all 0.2s",
            }}
            cursor="pointer"
            mb="5px"
        >
            <Avatar
                key={user.id}
                name={user.name}
                src={user.pic}
                size="md"
            ></Avatar>
            <Box display="flex" flexDirection="column" gap="3px">
                <Text fontSize="xl">{user.name}</Text>
                <Text>
                    <strong>Email:</strong> {user.email}
                </Text>
            </Box>
        </Box>
    );
};

export default UserListItem;
