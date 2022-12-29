import {
	Button,
	IconButton,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
	useDisclosure,
    Image,
    Text
} from "@chakra-ui/react";
import React from "react";

const ProfileModal = ({ user, children }) => {
	const { isOpen, onOpen, onClose } = useDisclosure();
	return (
		<>
			{children ? (
				<span onClick={onOpen}>{children}</span>
			) : (
				<IconButton
					display={{ base: "flex" }}
					icon={<i className="fa-solid fa-eye"></i>}
					onClick={onOpen}
				/>
			)}
			<Modal className='profile-modal' size='xs' isOpen={isOpen} onClose={onClose} isCentered>
				<ModalOverlay />
				<ModalContent h="410px">
					<ModalHeader fontSize='40px' fontFamily='Work Sans' display='flex' justifyContent='center'>{user.name}</ModalHeader>
					<ModalCloseButton />
					<ModalBody display='flex' flexDir='column' alignItems='center'  justifyContent='space-between' >
                        <Image borderRadius='full' boxSize='150px' src={user.pic} alt={user.name} />
                        <Text fontSize={{lg: '20px', md: '18px', sm: '15px'}} fontFamily="Work Sans">{user.email}</Text>
                    </ModalBody>

					<ModalFooter>
						<Button variant='ghost' colorScheme="blue" mr={3} onClick={onClose}>
							Close
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</>
	);
};

export default ProfileModal;
