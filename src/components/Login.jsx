import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
	VStack,
	FormControl,
	Input,
	FormLabel,
	InputGroup,
	InputRightElement,
	Button,
	useToast,
} from "@chakra-ui/react";

const Login = (props) => {
	const toast = useToast();
	const navigate = useNavigate();
	const [loading, setLoading] = useState(false);
	const [show, setShow] = useState(false);
	const [inputs, setInputs] = useState({ email: "", password: "" });


	const handleChange = (e) => {
		setInputs((prevValue) => {
			return { ...prevValue, [e.target.name]: e.target.value };
		});
	};

	function handleClick() {
		setShow(!show);
	}

	const handleSubmit = async () => {
		setLoading(true);
		if (inputs.email === "" || inputs.password === "") {
			toast({
				title: "Enter all mendetory fields",
				status: "warning",
				duration: 4000,
				isClosable: true,
				position: "bottom",
			});
			setLoading(false);
			return;
		}
		try {
			const response = await fetch(`https://chatbox-backend.onrender.com/api/user/login`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(inputs),
			});

			const json = await response.json();
			localStorage.setItem('userInfo', JSON.stringify(json));
			setLoading(false);
			if (json.success) {
				navigate("/chats");
				toast({
					title: "Logged In",
					status: "success",
					duration: 4000,
					isClosable: true,
					position: "top",
				});
			}
		} catch (err) {
			toast({
				title: "Inavid credentials.",
				status: "warning",
				duration: 4000,
				isClosable: true,
				position: "bottom",
			});
			setLoading(false);
			return;
		}
	};

	return (
		<VStack spacing={"5px"}>
			<FormControl isRequired>
				<FormLabel>Email</FormLabel>
				<Input
					name="email"
					value={inputs.email}
					id="login_email"
					placeholder="Enter Your Email"
					onChange={handleChange}
				/>
				<FormLabel>Password</FormLabel>
				<InputGroup>
					<Input
						name="password"
						value={inputs.password}
						type={show ? "text" : "password"}
						placeholder="Enter Your Password"
						onChange={handleChange}
					/>
					<InputRightElement w="4.5rem">
						<Button className="showPass-btn" h="1.75rem" size="sm" onClick={handleClick}>
							{show ? "Hide" : "Show"}
						</Button>
					</InputRightElement>
				</InputGroup>
				<Button
					colorScheme="blue"
					width="100%"
					style={{ marginTop: 15, marginBottom: 10 }}
					onClick={handleSubmit}
					isLoading={loading}
				>
					Login
				</Button>
				<Button
					variant="solid"
					colorScheme="red"
					w="100%"
					fontSize={{base: '.65rem', sm: '1rem'}}
					onClick={() => {
						setInputs({
							email: "guest@example.com",
							password: "123456",
						});
					}}
				>
					GET GUEST USER CREDENTIALS
				</Button>
			</FormControl>
		</VStack>
	);
};

export default Login;
