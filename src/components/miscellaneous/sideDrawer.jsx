import {
	Box,
	Button,
	Tooltip,
	Text,
	Menu,
	MenuButton,
	MenuList,
	Avatar,
	MenuItem,
	Drawer,
	useDisclosure,
	DrawerOverlay,
	DrawerContent,
	DrawerHeader,
	DrawerBody,
	Input,
	useToast,
	Spinner,
} from "@chakra-ui/react";
import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getSender } from "../../config/ChatLogics";
import { ChatState } from "../context/chatProvider";
import UserListItem from "../userAvatar/UserListItem";
import ChatLoading from "./ChatLoading";
import ProfileModal from "./ProfileModal";

const SideDrawer = (props) => {
	const [search, setSearch] = useState();
	const [loadingChat, setLoadingChat] = useState(false);
	const [searchResult, setSearchResult] = useState([]);
	const [loading, setLoading] = useState(false);
	const {
		user,
		setSelectedChat,
		chats,
		setChats,
		debouncer,
		notification,
		setNotification,
	} = ChatState();

	const navigate = useNavigate();
	const { isOpen, onOpen, onClose } = useDisclosure();

	const logoutHandler = () => {
		localStorage.removeItem("userInfo");
		navigate("/");
	};

	const toast = useToast();

	const searchedUsers = async (query) => {
		if (!query) {
			setSearchResult([]);
			return;
		}

		try {
			setLoading(true);
			const config = {
				headers: {
					Authorization: `Bearer ${user.token}`,
				},
			};

			const { data } = await axios.get(
				`/api/user?search=${query}`,
				config
			);
			setLoading(false);
			setSearchResult(data);
		} catch (error) {
			toast({
				title: "Error occured",
				description: "Failed to load the search results",
				status: "error",
				duration: 4000,
				isClosable: true,
				position: "bottom-left",
			});
			setLoading(false);
		}
	};

	const handleSearch = debouncer(searchedUsers, 500);

	const accessChat = async (userId) => {
		try {
			setLoadingChat(true);
			console.log(userId);

			const config = {
				headers: {
					Authorization: `Bearer ${user.token}`,
					"Content-Type": "application/json",
				},
			};

			const { data } = await axios.post(
				"/api/chat",
				{ userId },
				config
			);
			console.log(data);

			if (!chats.find((c) => c._id === data._id)) {
				setChats([data, ...chats]);
			}

			setSelectedChat(data);
			setLoadingChat(false);
			onClose();
		} catch (error) {
			toast({
				title: "Error fetching the chats",
				description: error.message,
				status: "error",
				duration: 4000,
				isClosable: true,
				position: "bottom-left",
			});
			setLoadingChat(false);
		}
	};

	return (
		<>
			<Box
				display="flex"
				justifyContent="space-between"
				alignItems="center"
				bg="white"
				w="100%"
				p="5px 10px 5px 10px"
			>
				<Tooltip label="Search users to chat" hasArrow placement="bottom-end">
					<Button variant="ghost" onClick={onOpen}>
						<i className="fa fa-search"></i>
						<Text display={{ base: "none", md: "flex" }} px="4">
							Search User
						</Text>
					</Button>
				</Tooltip>
				<Text
					fontSize={{ base: "xl", md: "3xl", lg: "3xl", sm: "3xl" }}
					fontFamily="Work Sans"
				>
					Chat Box
				</Text>
				<div>
					<Menu>
						<MenuButton p={1} m={1}>
							<div
								className={
									notification.length
										? "notification-icon"
										: "notification-icon d-none"
								}
							>
								{notification.length === 0 ? "" : notification.length}
							</div>
							<i className="fa-solid fa-bell me-2"></i>
						</MenuButton>
						<MenuList pl={2}>
							{!notification.length && "No new messages."}
							{notification.map((notif) => (
								<MenuItem
									key={notif._id}
									onClick={() => {
										setSelectedChat(notif.chat);
										setNotification(notification.filter((n) => n !== notif));
									}}
								>
									{notif.chat.isGroupChat
										? `New message in ${notif.chat.chatName}`
										: `New message from ${getSender(user, notif.chat.users)}`}
								</MenuItem>
							))}
						</MenuList>
					</Menu>
					<Menu>
						<MenuButton
							as={Button}
							rightIcon={<i className="fa-solid fa-chevron-down"></i>}
						>
							<Avatar
								size={{ base: "xs" }}
								cursor="pointer"
								name={user.name}
								src={user.pic}
							/>
						</MenuButton>
						<MenuList>
							<ProfileModal user={user}>
								<MenuItem>My Profile</MenuItem>
							</ProfileModal>
							<MenuItem onClick={logoutHandler}>Log out</MenuItem>
						</MenuList>
					</Menu>
				</div>
			</Box>

			<Drawer placement="left" onClose={onClose} isOpen={isOpen}>
				<DrawerOverlay />
				<DrawerContent>
					<DrawerHeader borderBottomWidth="1px">Search users</DrawerHeader>
					<DrawerBody>
						<Box display="flex" pb={2}>
							<Input
								placeholder="Search by name or email"
								mr={2}
								value={search}
								onChange={(e) => {
									handleSearch(e.target.value);
								}}
							/>
						</Box>
						{loading ? (
							<ChatLoading />
						) : (
							searchResult?.map((user) => {
								return (
									<UserListItem
										key={user._id}
										user={user}
										handleFunction={() => accessChat(user._id)}
									/>
								);
							})
						)}
						{loadingChat && <Spinner ml="auto" display="flex" />}
					</DrawerBody>
				</DrawerContent>
			</Drawer>
		</>
	);
};

export default SideDrawer;
