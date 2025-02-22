import { Box, Container, Tabs, Text } from '@chakra-ui/react'
import React, { useEffect } from 'react'
import Login from '../../COMPONENTS/Authentication/Login';
import SignUp from '../../COMPONENTS/Authentication/SignUp';
import { useNavigate } from 'react-router-dom';

const Home = () => {

   const navigate=useNavigate();

   useEffect(()=>{
    const user=JSON.parse(localStorage.getItem('userInfo'))
    if(user){
      navigate('/chat')
    }

   },[navigate])
  return (
    <Container maxW="xl" centerContent >
      <Box d='flex' justifyContent='center' p={3} bg={"white"} color={"black"} m='40px 0px 15px 0' w="100%" borderRadius='lg' borderWidth='1px'>
        <Text fontSize='4xl' font-family='work sans' textAlign='center' > 
          ChatApp
        </Text>
      </Box>
      <Box bg='white' w='100%' p={4} borderRadius='lg' borderWidth="1px" >
      <Tabs.Root variant="enclosed" maxW="md" fitted defaultValue={"tab-1"}>
      <Tabs.List bg={'white '} >
        <Tabs.Trigger value="tab-1" width='50% ' borderRadius="50px">Login

        </Tabs.Trigger>
        <Tabs.Trigger value="tab-2" width='50%' borderRadius="50px">SignUp</Tabs.Trigger>

      </Tabs.List>
      
      <Tabs.Content value="tab-1" color={"black"}>
        <Login/>
      </Tabs.Content>
        <Tabs.Content value="tab-2" color={"black"}>
          <SignUp/>
        </Tabs.Content>
    </Tabs.Root>


      </Box>
    </Container>
  );
}

export default Home;
