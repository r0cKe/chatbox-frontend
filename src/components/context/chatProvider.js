import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const ChatContext = createContext();

const ChatProvider = ({ children }) => {
	const [user, setUser] = useState();
	const [selectedChat, setSelectedChat] = useState();
	const [chats, setChats] = useState([]);
	const [notification, setNotification] = useState([]);
	const navigate = useNavigate();

	useEffect(() => {
		const userInfo = JSON.parse(localStorage.getItem("userInfo"));
		if (!userInfo) {
			navigate("/");
		}
		setUser(userInfo);
	}, [navigate]);

	const debouncer = function (fn, d) {
		let timer;
		return function () {
			let context = this,
				args = arguments;
			clearTimeout(timer);
			timer = setTimeout(() => {
				fn.apply(context, args);
			}, d);
		};
	};

	const throttle = function (fn, delay) {
		let flag = true;
		return function () {
			let context = this,
				args = arguments;
			if (flag) {
				fn.apply(context, args);
				flag = false;
				setTimeout(() => {
					flag = true;
				}, delay);
			}
		};
	};

	return (
		<ChatContext.Provider
			value={{
				user,
				setUser,
				selectedChat,
				setSelectedChat,
				chats,
				setChats,
				debouncer,
				throttle,
				notification,
				setNotification,
			}}
		>
			{children}
		</ChatContext.Provider>
	);
};

export const ChatState = () => {
	return useContext(ChatContext);
};

export default ChatProvider;
