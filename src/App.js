import "./App.css";
import {Routes, Route } from "react-router-dom";
import { ChakraProvider } from "@chakra-ui/react";
import Home from "./components/Home";
import Chats from "./pages/chatsPage";
import ChatProvider from "./components/context/chatProvider";

function App() {
	return (
		<ChatProvider>
			<ChakraProvider>
				<div className="App">
					<Routes>
						<Route exact path="/" element={<Home />} />
						<Route exact path="/chats" element={<Chats />} />
					</Routes>
				</div>
			</ChakraProvider>
		</ChatProvider>
	);
}

export default App;
