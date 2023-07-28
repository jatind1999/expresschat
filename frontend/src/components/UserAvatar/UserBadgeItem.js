import React from "react";
import { Box } from "@chakra-ui/react";
import { CloseIcon } from "@chakra-ui/icons";
const UserBadgeItem = ({ userName, handleDelete }) => {
    return (
        <Box
            background="#84d26b"
            border="1px solid #84d26b"
            borderRadius="5px"
            padding="5px 15px"
            display="flex"
            width="fit-content"
            alignItems="center"
            justifyContent="space-between"
            mt={2}
            gap="2px"
            cursor="pointer"
            onClick={handleDelete}
            position="relative"
            fontSize="14px"
            _hover={{ border: "1px solid red" }}
        >
            {userName}
            <CloseIcon boxSize={2} position="absolute" top="3px" right="3px" />
        </Box>
    );
};

export default UserBadgeItem;
