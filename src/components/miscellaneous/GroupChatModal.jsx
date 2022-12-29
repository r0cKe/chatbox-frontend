import React, { useState } from "react";
import {
	Button,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
	useDisclosure,
	useToast,
	FormControl,
	Input,
	Box,
} from "@chakra-ui/react";
import { ChatState } from "../context/chatProvider";
import axios from "axios";
import UserListItem from "../userAvatar/UserListItem";
import UserBadgeItem from "../userAvatar/UserBadgeItem";

const GroupChatModal = ({ children }) => {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const [groupChatName, setGroupChatName] = useState();
	const [selectedUsers, setSelectedUsers] = useState([]);
	const [search, setSearch] = useState("");
	const [searchResult, setSearchResult] = useState([]);
	const [loadingChat, setLoadingChat] = useState(false);

	const toast = useToast();

	const { user, chats, setChats, debouncer } = ChatState();

	const searchedUsers = async (query) => {
		if (!query) {
			return;
		}

		try {
			setLoadingChat(true);

			const config = {
				headers: {
					Authorization: `Bearer ${user.token}`,
					"Content-Type": "application/json",
				},
			};

			const { data } = await axios.get(
				`/api/user?search=${query}`,
				config
			);
			setLoadingChat(false);
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
			setLoadingChat(false);
		}
	};
	const handleSearch = debouncer(searchedUsers, 500);

	const addToSelectedUsers = (user) => {
		if (!user) {
			return;
		}
		if (selectedUsers.includes(user)) {
			toast({
				title: "User already added",
				status: "warning",
				duration: 4000,
				isClosable: true,
				position: "top",
			});
		}
		setSelectedUsers([...selectedUsers, user]);
	};

	const handleDelete = (userProvided) => {
		setSelectedUsers(
			selectedUsers.filter((user) => user._id !== userProvided._id)
		);
	};

	const handleSubmit = async () => {
		if (!groupChatName || !selectedUsers) {
			toast({
				title: "Please fill all the fields",
				status: "warning",
				duration: 4000,
				isClosable: true,
				position: "top",
			});
			return;
		}

		try {
			const config = {
				headers: {
					Authorization: `Bearer ${user.token}`,
					"Content-Type": "application/json",
				},
			};

			const { data } = await axios.post(
				"http://localhost:5000/api/chat/group",
				{
					name: groupChatName,
					users: JSON.stringify(selectedUsers.map((u) => u._id)),
				},
				config
			);
			setChats([data, ...chats]);
			onClose();
			toast({
				title: "New Group Chat Created",
				status: "success",
				duration: 4000,
				isClosable: true,
				position: "bottom",
			});
		} catch (error) {
			toast({
				title: "Failed to create the Chat!",
				description: error.response.data,
				status: "error",
				duration: 4000,
				isClosable: true,
				position: "bottom",
			});
		}
	};

	return (
		<>
			<span onClick={onOpen}>{children}</span>

			<Modal isOpen={isOpen} onClose={onClose}>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader>Create Group</ModalHeader>
					<ModalCloseButton />
					<ModalBody display="flex" flexDir="column" alignItems="center">
						<FormControl>
							<Input
								placeholder="Chat Name"
								mb={3}
								onChange={(e) => setGroupChatName(e.target.value)}
							/>
						</FormControl>
						<FormControl>
							<Input
								placeholder="Add users"
								mb={1}
								onChange={(e) => handleSearch(e.target.value)}
							/>
						</FormControl>
						<Box display="flex" flexWrap="wrap" w="100%">
							{selectedUsers?.map((user) => {
								return (
									<UserBadgeItem
										key={user._id}
										user={user}
										handleFunction={() => handleDelete(user)}
									/>
								);
							})}
						</Box>
						{searchResult?.slice(0, 4).map((user) => {
							return (
								<UserListItem
									key={user._id}
									user={user}
									handleFunction={() => addToSelectedUsers(user)}
								/>
							);
						})}
					</ModalBody>

					<ModalFooter>
						<Button colorScheme="blue" onClick={handleSubmit}>
							Create Chat
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</>
	);
};

export default GroupChatModal;
