import { Box } from "@chakra-ui/react";
import React, { useState, useEffect } from "react";

const NotificationBadge = ({ count }) => {
    const [isRendered, setIsRendered] = useState();

    useEffect(() => {
        setIsRendered(true);
    }, []);
    return (
        <Box
            background={"red"}
            color="white"
            position="absolute"
            borderRadius="50%"
            top="-5px"
            right="-5px"
            width="20px"
            height="20px"
            display="flex"
            alignItems="center"
            justifyContent="center"
            fontSize="12px"
            transition="opacity 0.2s, scale 1s"
            transform={`scale(${isRendered ? 1 : 0.01})`}
            opacity={isRendered ? 1 : 0}
        >
            {count}
        </Box>
    );
};

export default NotificationBadge;
