import { Image, Container, Button, Box, Grid, GridItem, Stack, HStack } from '@chakra-ui/react';
import logo from '../assets/logo_separated.png';
import { useNavigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { MockAuth } from '../mockAuth/mockAuth';

export default function NavBar({ authenticated }) {
  const navigate = useNavigate();

  let authService = {
    "DEV": MockAuth,
    "TEST": useAuth0
  }

  const { loginWithRedirect, logout } = authService[process.env.REACT_APP_AUTH]();

  const navigateToHomePage = () => {
    navigate('/');
  };

  return (
    <Container
      as="header"
      pos="fixed"
      top={0}
      left={0}
      w="100%"
      display="flex"
      p="5"
      maxH="12vh"
      minW="100vw"
      bgColor="balance.header_color"
      centerContent
      overflow="hidden"
      zIndex={999}
    >
      <HStack w="100%">
        <Box width='40%'>


        </Box>
        <button onClick={navigateToHomePage} width="10%">
        {' '}
        <Image height="8vh" src={logo} alt="BaLance: Team Forming Dashboard" />
      </button>
      <Box width='30%'>

      </Box>
      {!authenticated && (
        <Button onClick={loginWithRedirect} height="8vh">Login</Button>
      )}
      {authenticated && (
        <Button onClick={logout} height="8vh">Logout</Button>
      )}
      </HStack>
    </Container>
  );
}
