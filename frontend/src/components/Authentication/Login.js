import React, { useState } from "react";
import {
    VStack,
    FormControl,
    FormLabel,
    Input,
    InputGroup,
    InputRightElement,
    Button,
    useToast,
} from "@chakra-ui/react";
import axios from "axios";
import { useHistory } from "react-router-dom";
const BACKEND_API = require("../../config/ApiServer");
const URL = BACKEND_API.URL;

console.log(`URL fetched is: ${URL}`);

const Login = () => {
    // defining states
    const [show, setShow] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const toast = useToast();
    const history = useHistory();

    // handling show button
    const handleShow = () => {
        setShow(!show);
    };

    const submitHandler = async () => {
        setLoading(true);
        // Check if all the fields of the form are entered or not.
        if (!email || !password) {
            toast({
                title: "Empty fields.",
                description: "Please enter email and password to login.",
                duration: "3000",
                status: "error",
                isClosable: true,
            });
            setLoading(false);
            return;
        }

        // hitting post request to /api/user/login route for login.
        const config = {
            headers: {
                "Content-type": "application/json",
            },
        };

        try {
            const { data } = await axios.post(
                `${URL}/api/user/login`,
                { email, password },
                config
            );
            // set the data to localstorage.
            console.log("setting up local storage for logged in user.", data);
            localStorage.setItem("userInfo", JSON.stringify(data));
            setLoading(false);
            history.push("/api/chat");
        } catch (error) {
            toast({
                title: "Login Failed",
                description: "Incorrect password or email.",
                duration: "3000",
                status: "error",
                isClosable: true,
                position: "bottom",
            });
            setLoading(false);
            return;
        }
        // Show Success Toast
        toast({
            title: "Welcome Back",
            description: "Login Successfull",
            duration: "3000",
            status: "success",
            isClosable: true,
        });
    };

    return (
        <VStack spacing={"6px"} width={"400px"}>
            <FormControl isRequired>
                <FormLabel>Email</FormLabel>
                <Input
                    type="email"
                    id="email"
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                />
            </FormControl>
            <FormControl isRequired>
                <FormLabel>Password</FormLabel>
                <InputGroup>
                    <Input
                        type={show ? "text" : "password"}
                        id="password"
                        onChange={(e) => setPassword(e.target.value)}
                        value={password}
                    />
                    <InputRightElement>
                        <Button
                            colorScheme="blue"
                            variant={"outline"}
                            size={"sm"}
                            fontSize={"12px"}
                            padding={"0px 20px"}
                            marginRight={"10px"}
                            onClick={handleShow}
                        >
                            show
                        </Button>
                    </InputRightElement>
                </InputGroup>
            </FormControl>

            <Button
                colorScheme="blue"
                size={"md"}
                width={"100%"}
                variant={"outline"}
                marginTop={"15px"}
                isLoading={loading}
                onClick={submitHandler}
            >
                Log In
            </Button>

            <Button
                colorScheme="blue"
                size={"md"}
                width={"100%"}
                variant={"outline"}
                marginTop={"10px"}
                onClick={() => {
                    setEmail("guestuser@guestuser.com");
                    setPassword("guestuser");
                }}
            >
                Get Guest User Credentials
            </Button>
        </VStack>
    );
};

export default Login;
