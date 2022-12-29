import { Box } from '@chakra-ui/react'
import React from 'react'

const UserBadgeItem = ({user, handleFunction}) => {
    return (
        <Box
        px={2}
        py={1}
        borderRadius='lg'
        m={1}
        mb={2}
        varient='solid'
        fontSize={14}
        bg='purple'
        color='white'
        cursor='pointer'
        
        >
            {user.name}
            <i className="fa-solid fa-xmark ps-2" onClick={handleFunction}></i>
        </Box>
    )
}

export default UserBadgeItem
