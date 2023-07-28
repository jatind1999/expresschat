import { createContext, useState, useContext, useEffect } from "react";
import { useHistory } from "react-router-dom";

// creating context
const ChatContext = createContext();

// setting up and exporting provider.
export const ChatProvider = ({ children }) => {
    // states
    const [user, setUser] = useState();
    const [selectedChat, setSelectedChat] = useState();
    const [chats, setChats] = useState([]);
    const [notifications, setNotifications] = useState([]);
    const history = useHistory();

    // useEffect hook to run everytime if the user is not logged in.
    useEffect(() => {
        const userInfo = JSON.parse(localStorage.getItem("userInfo"));
        setUser(userInfo);
        // if there is no user info in local storage then user is not logged in.
        if (!userInfo) {
            history.push("/");
        }
    }, [history]);

    return (
        <ChatContext.Provider
            value={{
                user,
                setUser,
                selectedChat,
                setSelectedChat,
                chats,
                setChats,
                notifications,
                setNotifications,
            }}
        >
            {children}
        </ChatContext.Provider>
    );
};

export const ChatState = () => {
    return useContext(ChatContext);
};
