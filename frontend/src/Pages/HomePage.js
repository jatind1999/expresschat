import React from "react";
import {
    Tabs,
    TabList,
    TabPanels,
    Tab,
    TabPanel,
    Container,
    Box,
    Heading,
    Stack,
} from "@chakra-ui/react";
import Signup from "../components/Authentication/Signup";
import Login from "../components/Authentication/Login";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { useEffect } from "react";

const HomePage = () => {
    const history = useHistory();
    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("userInfo"));
        console.log("HomePage useEffect Runs");
        if (user) {
            console.log("Pushing to chat Page.");
            history.push("/api/chat");
        } else {
            console.log("User Becomes undefined");
        }
    }, [history]);
    return (
        <Container
            display={"flex"}
            color={"white"}
            gap={"40px"}
            minW={"320px"}
            margin={"10px"}
        >
            <Box>
                <Stack
                    spacing={6}
                    width={"300px"}
                    height={"100%"}
                    display={"flex"}
                    justifyContent={"center"}
                >
                    <Heading as="h1" size="2xl">
                        Express
                    </Heading>

                    <Heading as="h3" size="lg" fontWeight={300}>
                        Express lets you connect with people.
                    </Heading>
                </Stack>
            </Box>
            <Box
                padding={"10px"}
                border={"1px solid #dadae0"}
                borderRadius={"10px"}
                paddingTop={"20px"}
                boxShadow={"0px 0px 10px 10px rgba(0,0,0,0.2)"}
            >
                <Tabs
                    variant="soft-rounded"
                    colorScheme="orange"
                    width={"100%"}
                >
                    <TabList>
                        <Tab width={"50%"}>Login</Tab>
                        <Tab width={"50%"}>Signup</Tab>
                    </TabList>
                    <TabPanels>
                        <TabPanel>
                            <Login></Login>
                        </TabPanel>
                        <TabPanel>
                            <Signup></Signup>
                        </TabPanel>
                    </TabPanels>
                </Tabs>
            </Box>
        </Container>
    );
};

export default HomePage;
