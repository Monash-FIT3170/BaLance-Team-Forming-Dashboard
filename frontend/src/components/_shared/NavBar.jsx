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
      height={["4vh", "3vw", "8vh", "5vw", "5em"]}
      bgColor="balance.header_color"
      justifyContent="space-between"
      alignItems="center"
      zIndex={999}
    >
      <Flex alignItems="center">
        <Link as={RouterLink} to="/">
          <Image
            height="auto"
            minHeight="1em"
            maxHeight="4em"
            minWidth="4em"
            src={logo}
            alt="BaLance: Team Forming Dashboard"
          />
        </Link>
        <Link as={RouterLink} to="/home" ml="2vw">
          <Button colorScheme="white" variant="solid" color="black" fontSize={["3.2vw", "3.2vw", "3.2vw", "2em"]} fontWeight="light" size="lg" height="63" px="2vw">   
          {/* original size is 20, and no fontWeight*/}
            Home
          </Button>
        </Link>
        <Link as={RouterLink} to="/tutorial" ml="2vw">
          <Button colorScheme="white" variant="solid" color="black" fontSize={["3.2vw", "3.2vw", "3.2vw", "2em"]} fontWeight="light" size="lg" height="63" px="2vw">
            Tutorial
          </Button>
        </Link>
        <Link as={RouterLink} to="/faq" ml="2vw">
          <Button colorScheme="white" variant="solid" color="black" fontSize={["3.2vw", "3.2vw", "3.2vw", "2em"]} fontWeight="light" size="lg" height="63" px="2vw">
            FAQ
          </Button>
        </Link>
        <Link as={RouterLink} to="/contributors" ml="2vw">
          <Button colorScheme="white" variant="solid" color="black" fontSize={["3.2vw", "3.2vw", "3.2vw", "2em"]} fontWeight="light" size="lg" height="63" px="2vw">
            Contributors
          </Button>
        </Link>

      </Flex>
      <Flex>
        {authenticated ? (
          <Button onClick={logout} size="lg" shadow="lg">Logout</Button>
        ) : (
          <Link as={RouterLink} to="/login" ml="8">
            <Button>
              Login
            </Button>
          </Link>
        )}
      </Flex>
    </Flex>
  );
};

export default NavBar;