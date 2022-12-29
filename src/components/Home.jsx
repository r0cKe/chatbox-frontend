import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import Login from "./Login";
import Signup from "./Signup";
import {
	Container,
	Box,
	Center,
	TabList,
	Tab,
	Tabs,
	TabPanels,
	TabPanel,
} from "@chakra-ui/react";

const Home = () => {
	const navigate = useNavigate();

	useEffect(() => {
		const userInfo = JSON.parse(localStorage.getItem("userInfo"));
		if (userInfo) {
			navigate("/chats");
		}
	}, [navigate]);

	return (
		<Container maxW="xl" centerContent>
			<Box
				d="flex"
				justifyContent="center"
				p={3}
				bg={"white"}
				w="100%"
				m="40px 0 15px 0"
				borderRadius="lg"
				borderWidth="1px"
			>
				<Center fontSize="4xl" fontFamily="Work Sans">
					Chat Box
				</Center>
			</Box>
			<Box bg="white" w="100%" p={4} borderRadius="lg" borderWidth="1px">
				<Tabs variant="soft-rounded">
					<TabList>
						<Tab w="50%">Login</Tab>
						<Tab w="50%">Sign Up</Tab>
					</TabList>
					<TabPanels>
						<TabPanel>
							<Login />
						</TabPanel>
						<TabPanel>
							<Signup />
						</TabPanel>
					</TabPanels>
				</Tabs>
			</Box>
		</Container>
	);
};

export default Home;
