import { Box, Image, Text } from '@chakra-ui/react'
import React from 'react'

const UserList = ({user,handleFunction}) => {

  return (
    <>
           <Box
            key={user._id}
            onClick={handleFunction}
            display="flex"
            alignItems="center"
            p={2}
            borderBottom="1px solid lightgray"
            borderRadius="md"
            cursor="pointer"
            background="white"
            marginTop="10px"
            _hover={{ bg: "gray.200" }}
          >
            <Image
              src={user.pic}
              alt={user.name}
              boxSize="40px"
              borderRadius="full"
              mr={3}
            />
            <Box className="bg-white text-black w-100 rounded ">
              <Text fontWeight="bold" className="px-3 mt-2" ><strong>{user.name}</strong></Text>
              <Text fontSize="sm" className="px-1" color="gray.500">
                {user.email}
              </Text>
            </Box>
           </Box>

      
    </>
  )
}

export default UserList
