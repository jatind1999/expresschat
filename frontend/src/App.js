import "./App.css";
// 1. import `ChakraProvider` component
import { ChakraProvider } from "@chakra-ui/react";
// import { Button } from '@chakra-ui/react';
import { Route } from "react-router-dom";
import ChatPage from "./Pages/ChatPage";
import HomePage from "./Pages/HomePage";
function App() {
    return (
        <div className="App">
            <Route path="/" component={HomePage} exact />
            <Route path="/api/chat" component={ChatPage} />
        </div>
    );
}

export default App;
