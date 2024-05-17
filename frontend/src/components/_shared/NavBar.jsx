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
      height={["5vw", "5vh", "10vw", "10vh", "5em"]}
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
        <Link as={RouterLink} to="/home" ml="0.8vw">
          <Button colorScheme="white" variant="solid" color="black" fontSize={["2vw", "2vw", "3vw", "2em"]} fontWeight="light" size="lg" height="63" px="6">   
          {/* original size is 20, and no fontWeight*/}
            Home
          </Button>
        </Link>
        <Link as={RouterLink} to="/tutorial" ml="0.8vw">
          <Button colorScheme="white" variant="solid" color="black" fontSize={["2vw", "2vw", "3vw", "2em"]} fontWeight="light" size="lg" height="63" px="6">
            Tutorial
          </Button>
        </Link>
        <Link as={RouterLink} to="/faq" ml="0.8vw">
          <Button colorScheme="white" variant="solid" color="black" fontSize={["2vw", "2vw", "3vw", "2em"]} fontWeight="light" size="lg" height="63" px="6">
            FAQ
          </Button>
        </Link>
        <Link as={RouterLink} to="/contributors" ml="0.8vw">
          <Button colorScheme="white" variant="solid" color="black" fontSize={["2vw", "2vw", "3vw", "2em"]} fontWeight="light" size="lg" height="63" px="6">
            Contributors
          </Button>
        </Link>

      </Flex>
      <Flex>
        {authenticated ? (
          <Button onClick={logout} size="lg" shadow="lg" h={["2vw", "2vh", "3em"]} w={["3vw", "4vh", "6em"]}>Logout</Button>
        ) : (
          <Link as={RouterLink} to="/login" ml="8">
            <Button h={["2vw", "2vh", "3em"]} w={["3vw", "4vh", "6em"]}>
              Login
            </Button>
          </Link>
        )}
      </Flex>
    </Flex>
  );
};

export default NavBar;