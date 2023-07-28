import React from "react";
import {
    IconButton,
    useDisclosure,
    Image,
    Text,
    Modal,
    ModalBody,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
} from "@chakra-ui/react";
import { ViewIcon } from "@chakra-ui/icons";
const ProfileModal = ({ user, children }) => {
    // Modal States
    const { isOpen, onOpen, onClose } = useDisclosure();
    return (
        <>
            {children ? (
                <span onClick={onOpen}>{children}</span>
            ) : (
                <IconButton
                    d={{ base: "flex" }}
                    aria-label="Click to view"
                    onClick={onOpen}
                    icon={<ViewIcon />}
                />
            )}

            <Modal isOpen={isOpen} onClose={onClose} isCentered={true}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader
                        fontSize="40px"
                        display="flex"
                        justifyContent="center"
                    >
                        {user.name}
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody
                        display="flex"
                        flexDirection="column"
                        gap="10px"
                        justifyContent="center"
                        alignItems="center"
                    >
                        <Image
                            src={user.pic}
                            alt={user.name}
                            borderRadius="full"
                            boxSize="150px"
                        />
                        <Text fontSize="20px">{user.email}</Text>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    );
};

export default ProfileModal;
