import {
	Box,
	Button,
	FormControl,
	IconButton,
	Input,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
	Spinner,
	useDisclosure,
	useToast,
} from "@chakra-ui/react";
import axios from "axios";
import React, { useState } from "react";
import { ChatState } from "../context/chatProvider";
import UserBadgeItem from "../userAvatar/UserBadgeItem";
import UserListItem from "../userAvatar/UserListItem";

const UpdateGroupChatModal = ({ fetchAgain, setFetchAgain, fetchMessages }) => {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const [groupChatName, setGroupChatName] = useState();
	const [searchResult, setSearchResult] = useState([]);
	const [loading, setLoading] = useState(false);
	const [renameLoading, setRenameLoading] = useState(false);

	const toast = useToast();

	const { user, selectedChat, setSelectedChat, debouncer } = ChatState();

	const handleRemove = async (selUser) => {
		if (selectedChat.users.length === 3) {
			toast({
				title: "Cannot remove user",
				description: "Group chat must have atleast 3 members",
				status: "warning",
				duration: 4000,
				isClosable: true,
				position: "bottom",
			});
			return;
		}
		if (selectedChat.groupAdmin._id !== user._id && selUser._id !== user._id) {
			toast({
				title: "Only admin can remove users",
				status: "error",
				duration: 4000,
				isClosable: true,
				position: "bottom",
			});
			return;
		}

		try {
			setLoading(true);

			const config = {
				headers: {
					Authorization: `Bearer ${user.token}`,
					"Content-Type": "application/json",
				},
			};

			const { data } = await axios.put(
				"https://chatbox-backend.onrender.com/api/chat/groupremove",
				{
					chatId: selectedChat._id,
					userId: selUser._id,
				},
				config
			);

			selUser._id === user._id ? setSelectedChat() : setSelectedChat(data);
			setFetchAgain(!fetchAgain);
			fetchMessages();
			setLoading(false);
		} catch (error) {
			toast({
				title: "Error occured",
				description: error.response.data.message,
				status: "error",
				duration: 4000,
				isClosable: true,
				position: "bottom",
			});
			setLoading(false);
		}
	};

	const addToSelectedUsers = async (selUser) => {
		if (!selUser) {
			return;
		}
		if (selectedChat.users.includes(selUser)) {
			toast({
				title: "User already added",
				status: "warning",
				duration: 4000,
				isClosable: true,
				position: "bottom",
			});
			return;
		}

		if (selectedChat.groupAdmin._id !== selUser._id) {
			toast({
				title: "Only admin can add users",
				status: "error",
				duration: 4000,
				isClosable: true,
				position: "bottom",
			});
			return;
		}

		try {
			setLoading(true);

			const config = {
				headers: {
					Authorization: `Bearer ${selUser.token}`,
					"Content-Type": "application/json",
				},
			};

			const { data } = await axios.put(
				"https://chatbox-backend.onrender.com/api/chat/groupadd",
				{
					chatId: selectedChat._id,
					userId: selUser._id,
				},
				config
			);

			setSelectedChat(data);
			setFetchAgain(!fetchAgain);
			setLoading(false);
		} catch (error) {
			toast({
				title: "Error occured",
				description: error.response.data.message,
				status: "error",
				duration: 4000,
				isClosable: true,
				position: "bottom",
			});
			setLoading(false);
		}
	};

	const handleRename = async () => {
		if (!groupChatName) return;

		try {
			setRenameLoading(true);

			const config = {
				headers: {
					Authorization: `Bearer ${user.token}`,
					"Content-Type": "application/json",
				},
			};

			const { data } = await axios.put(
				"https://chatbox-backend.onrender.com/api/chat/rename",
				{ chatId: selectedChat._id, chatName: groupChatName },
				config
			);

			setSelectedChat(data);
			setFetchAgain(!fetchAgain);
			setRenameLoading(false);
		} catch (error) {
			toast({
				title: "Error Occured",
				description: error.response.data.message,
				status: "error",
				duration: 4000,
				isClosable: true,
				position: "bottom",
			});
			setRenameLoading(false);
		}
		setFetchAgain("");
	};

	const searchedUsers = async (query) => {
		if (!query) {
			return;
		}

		try {
			// setLoadingChat(true);

			const config = {
				headers: {
					Authorization: `Bearer ${user.token}`,
					"Content-Type": "application/json",
				},
			};

			const { data } = await axios.get(
				`https://chatbox-backend.onrender.com/api/user?search=${query}`,
				config
			);
			console.log(data);
			// setLoadingChat(false);
			setSearchResult(data);
		} catch (error) {
			toast({
				title: "Error Occured",
				description: "Failed to load the search results",
				status: "error",
				duration: 4000,
				isClosable: true,
				position: "bottom-left",
			});
			// setLoadingChat(false);
		}
	};
	const handleSearch = debouncer(searchedUsers, 500);

	return (
		<>
			<IconButton
				display={{ base: "flex" }}
				icon={<i className="fa-solid fa-eye"></i>}
				onClick={onOpen}
			/>

			<Modal isOpen={isOpen} onClose={onClose}>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader
						fontSize="35px"
						fontFamily="Work Sans"
						display="flex"
						justifyContent="center"
					>
						{selectedChat.chatName}
					</ModalHeader>
					<ModalCloseButton />
					<ModalBody>
						<Box w="100%" display="flex" flexWrap="wrap" pb={3}>
							{selectedChat.users.map((user) => {
								return (
									<UserBadgeItem
										key={user._id}
										user={user}
										handleFunction={() => handleRemove(user)}
									/>
								);
							})}
						</Box>
						<FormControl display="flex">
							<Input
								placeholder="Chat Name"
								mb={3}
								value={groupChatName}
								onChange={(e) => setGroupChatName(e.target.value)}
							/>
							<Button
								varient="solid"
								colorScheme="teal"
								ml={1}
								isLoading={renameLoading}
								onClick={handleRename}
							>
								Update
							</Button>
						</FormControl>
						<FormControl>
							<Input
								placeholder="Add users"
								mb={1}
								onChange={(e) => handleSearch(e.target.value)}
							/>
						</FormControl>
						{loading ? (
							<Spinner size="lg" />
						) : (
							searchResult?.slice(0, 4).map((user) => {
								return (
									<UserListItem
										key={user._id}
										user={user}
										handleFunction={() => addToSelectedUsers(user)}
									/>
								);
							})
						)}
					</ModalBody>
					<ModalFooter>
						<Button colorScheme="red" onClick={() => handleRemove(user)}>
							Leave Group
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</>
	);
};

export default UpdateGroupChatModal;
