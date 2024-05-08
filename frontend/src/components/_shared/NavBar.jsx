import { useAuth0 } from '@auth0/auth0-react';
import { Image, Flex, Button, Link } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';

import { MockAuth } from '../../helpers/mockAuth';
import logo from '../../assets/logo_separated.png';

const NavBar = ({ authenticated }) => {
  let authService = {
    DEV: MockAuth,
    TEST: useAuth0,
  };

  const { loginWithRedirect, logout } =
    authService[import.meta.env.VITE_REACT_APP_AUTH]();

  return (
    <Flex as="header"
      pos="fixed"
      top={0}
      left={0}
      right={0}
      p="5"
      bgColor="balance.header_color"
      justifyContent="space-between"
      alignItems="center"
      zIndex={999}
    >
      <Flex alignItems="center">
        <Link as={RouterLink} to="/">
          <Image
            height="auto"
            maxHeight="4em"
            src={logo}
            alt="BaLance: Team Forming Dashboard"
          />
        </Link>
        <Link as={RouterLink} to="/home" ml="8">
          <Button colorScheme="white" variant="solid" color="black" fontSize="20px" size="lg" height="63" px="6">
            Home
          </Button>
        </Link>
      </Flex>
      <Flex>
        {authenticated ? (
          <Button onClick={logout}>Logout</Button>
        ) : (
          <Button onClick={loginWithRedirect} h="3em" w="6em">
            Login
          </Button>
        )}
      </Flex>
    </Flex>
  );
};

export default NavBar;