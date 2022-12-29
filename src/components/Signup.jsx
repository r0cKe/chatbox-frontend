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

const Signup = (props) => {
	const navigate = useNavigate();
	const [show, setShow] = useState(false);
	const [loading, setLoading] = useState(false);
	const toast = useToast();
	const [inputs, setInputs] = useState({
		name: "",
		email: "",
		password: "",
	});
	const [pic, setPic] = useState();
	const [confirmPassword, setConfirmPassword] = useState();


	const handleChange = (e) => {
		setInputs((prevValue) => {
			return { ...prevValue, [e.target.name]: e.target.value };
		});
	};

	const handlePicChange = (e) => {
		setLoading(true);
		const submittedPic = e.target.files[0];

		if (submittedPic === undefined) {
			toast({
				title: "Please select an image.",
				status: "warning",
				duration: 4000,
				isClosable: true,
				position: "bottom",
			});
			setLoading(false);
			return;
		}

		if (
			submittedPic.type === "image/jpeg" ||
			submittedPic.type === "image/jpg" ||
			submittedPic.type === "image/png"
		) {
			const data = new FormData();

			// Uploading the image to cloudinary
			data.append("file", submittedPic), //eslint-disable-line
				data.append("upload_preset", "chat-box"),
				data.append("cloud_name", "r0cket"),
				fetch("https://api.cloudinary.com/v1_1/r0cket/image/upload", {
					method: "POST",
					body: data,
				})
					.then((res) => res.json())
					.then((data) => {
						console.log(data);
						setPic(data.url.toString());
						setLoading(false);
					})
					.catch((err) => {
						console.log(err);
						setLoading(false);
					});
		} else {
			toast({
				title: "Image type not supported.",
				status: "warning",
				duration: 4000,
				isClosable: true,
				position: "bottom",
			});
			setLoading(false);
			return;
		}
	};

	const handleClick = () => setShow(!show);

	const handleSubmit = async () => {
		setLoading(true);
		if (
			inputs.name === "" ||
			inputs.email === "" ||
			inputs.password === "" ||
			!confirmPassword
		) {
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
		if (inputs.password !== confirmPassword) {
			toast({
				title: "Passwords do not match.",
				status: "warning",
				duration: 4000,
				isClosable: true,
				position: "bottom",
			});
			setLoading(false);

			return;
		}

		try {
			const response = await fetch(`/api/user`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ ...inputs, pic }),
			});

			const json = await response.json();
			localStorage.setItem("userInfo", JSON.stringify(json));

			setLoading(false);
			toast({
				title: "User Signed Up",
				status: "success",
				duration: 4000,
				isClosable: true,
				position: "top",
			});
			if (json.success) {
				navigate("/chats");
			}
		} catch (err) {
			toast({
				title: "Passwords do not match.",
				status: "warning",
				duration: 4000,
				isClosable: true,
				position: "bottom",
			});
			setLoading(false);
		}
	};

	return (
		<VStack spacing={"5px"}>
			<FormControl isRequired>
				<FormLabel>Name</FormLabel>
				<Input
					name="name"
					id="signup_name"
					placeholder="Enter Your Name"
					value={inputs.name}
					onChange={handleChange}
				/>
				<FormLabel>Email</FormLabel>
				<Input
					name="email"
					value={inputs.email}
					id="signup_email"
					placeholder="Enter Your Email"
					onChange={handleChange}
				/>
				<FormLabel>Password</FormLabel>
				<InputGroup>
					<Input
						name="password"
						value={inputs.password}
						id="signup-password"
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
				<FormLabel> Confirm Password</FormLabel>
				<InputGroup>
					<Input
						name="confirmPassword"
						type={show ? "text" : "password"}
						placeholder="Confirm Password"
						value={confirmPassword}
						onChange={(e) => {
							setConfirmPassword(e.target.value);
						}}
					/>
					<InputRightElement w="4.5rem">
						<Button className="showPass-btn" h="1.75rem" size="sm" onClick={handleClick}>
							{show ? "Hide" : "Show"}
						</Button>
					</InputRightElement>
				</InputGroup>
			</FormControl>
			<FormControl id="pic">
				<FormLabel>Upload your Picture</FormLabel>
				<Input
					name="pic"
					type="file"
					p={1.5}
					accept="image/*"
					onChange={handlePicChange}
				/>
			</FormControl>

			<Button
				colorScheme="blue"
				width="100%"
				style={{ marginTop: 15 }}
				onClick={handleSubmit}
				isLoading={loading}
			>
				Signup
			</Button>
		</VStack>
	);
};

export default Signup;
