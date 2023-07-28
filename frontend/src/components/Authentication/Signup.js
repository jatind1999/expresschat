import React, { useState } from "react";
import {
    Button,
    FormControl,
    FormLabel,
    Input,
    InputRightElement,
    InputGroup,
    VStack,
    useToast,
} from "@chakra-ui/react";
import axios from "axios";
import { useHistory } from "react-router-dom";
const BACKEND_API = require("../../config/ApiServer");

const Signup = () => {
    // defining states
    const [show, setShow] = useState(false);
    const [name, setName] = useState();
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [confirmPassword, setConfirmPassword] = useState();
    const [pic, setPic] = useState();
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
        if (!name || !email || !password || !confirmPassword || !pic) {
            toast({
                title: "Empty fields.",
                description: "Please enter all fields in the form.",
                duration: "3000",
                status: "error",
                isClosable: true,
            });
            setLoading(false);
            return;
        }

        // check if the passwords match on both password fields.
        if (password !== confirmPassword) {
            toast({
                title: "Password fields dont match!",
                description:
                    "Please make sure that both the password fields match",
                duration: "3000",
                status: "error",
                isClosable: true,
            });
            setLoading(false);
            return;
        }

        // push the data to the mongodb database.
        // hitting post request to /api/user route for registration.
        const config = {
            headers: {
                "Content-type": "application/json",
            },
        };

        try {
            const { data } = await axios.post(
                `${BACKEND_API}/api/user`,
                { name, email, password, pic },
                config
            );
            // set the data to localstorage.
            localStorage.setItem("userInfo", JSON.stringify(data));
            history.push("/");
        } catch (error) {
            toast({
                title: "Oops! Something went wrong.",
                description: error.response.data.message,
                duration: "3000",
                status: "error",
                isClosable: true,
                position: "bottom",
            });
            setLoading(false);
        }
        // Show Success Toast
        toast({
            title: "Success",
            description: "Registration Successful",
            duration: "3000",
            status: "success",
            isClosable: true,
        });

        setLoading(false);
    };

    const handleUpload = (pic) => {
        // check if the image is undefined or not.
        if (!pic) {
            toast({
                title: "No image uploaded",
                description: "Please choose any image to upload.",
                duration: "3000",
                status: "error",
                isClosable: true,
            });
        }

        // If the image extention is jpeg or png, then accept the image.
        if (pic.type === "image/jpeg" || pic.type === "image/png") {
            setLoading(true);
            // form data object to be send via axios request.
            const data = new FormData();
            data.append("file", pic);
            data.append("upload_preset", "realtimechatapp");
            data.append("cloud_name", "dfnghkhq9");

            // making api call.
            fetch("https://api.cloudinary.com/v1_1/dfnghkhq9/image/upload", {
                method: "POST",
                body: data,
            })
                .then((res) => res.json())
                .then((data) => {
                    setPic(data.url.toString());
                    console.log(data.url.toString());
                    setLoading(false);
                })
                .catch((err) => {
                    console.log(err);
                    setLoading(false);
                });
        } else {
            toast({
                title: "Please select a valid image.",
                description:
                    "Please note that the file should be an image of type either jpeg or png.",
                duration: "5000",
                status: "error",
                isClosable: true,
            });
        }
    };

    return (
        <VStack spacing={"6px"} width={"400px"}>
            <FormControl isRequired>
                <FormLabel>Name</FormLabel>
                <Input
                    type="text"
                    id="first-name"
                    placeholder="John Doe"
                    onChange={(e) => setName(e.target.value)}
                />
            </FormControl>
            <FormControl isRequired>
                <FormLabel>Email</FormLabel>
                <Input
                    type="email"
                    id="email"
                    placeholder="example@example.com"
                    onChange={(e) => setEmail(e.target.value)}
                />
            </FormControl>
            <FormControl isRequired>
                <FormLabel>Password</FormLabel>
                <InputGroup>
                    <Input
                        type={show ? "text" : "password"}
                        id="password"
                        placeholder="********"
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <InputRightElement>
                        <Button
                            colorScheme="blue"
                            variant={"outline"}
                            size={"sm"}
                            fontSize={"12px"}
                            width={"20px"}
                            padding={"0px 20px"}
                            marginRight={"10px"}
                            onClick={handleShow}
                        >
                            show
                        </Button>
                    </InputRightElement>
                </InputGroup>
            </FormControl>
            <FormControl isRequired>
                <FormLabel>Confirm Password</FormLabel>
                <Input
                    type="password"
                    id="confirm-password"
                    placeholder="********"
                    onChange={(e) => setConfirmPassword(e.target.value)}
                />
            </FormControl>
            <FormControl>
                <FormLabel>Upload your picture</FormLabel>
                <Input
                    paddingTop={"4px"}
                    type="file"
                    onChange={(e) => handleUpload(e.target.files[0])}
                />
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
                Sign Up
            </Button>
        </VStack>
    );
};

export default Signup;
