import { useAuth0 } from '@auth0/auth0-react';
import { Image, Flex, Button, Link,Menu,MenuButton,MenuList,MenuItem,Avatar, IconButton } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { ChevronDownIcon } from '@chakra-ui/icons';
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
      height="10vh"
      maxHeight="5em"
      bgColor="balance.header_color"
      justifyContent="space-between"
      alignItems="center"
      zIndex={999}
    >
      <Flex alignItems="center">
        <Link as={RouterLink} to="/">
          <Image
            height="8vh"
            width="40vh"
            minHeight="1.8em"
            maxHeight="4em"
            maxWidth="20em"
            minWidth="9em"
            src={logo}
            alt="BaLance: Team Forming Dashboard"
          />
        </Link>
        <Link as={RouterLink} to="/home" ml="8">
          <Button colorScheme="white" variant="solid" color="black" fontSize="1.4em" fontWeight="light" size="lg" height="63" px="6">   
          {/* original size is 20, and no fontWeight*/}
            <b>Home</b>
          </Button>
        </Link>
        <Link as={RouterLink} to="/tutorial" ml="8">
          <Button colorScheme="white" variant="solid" color="black" fontSize="1.4em" fontWeight="light" size="lg" height="63" px="6">
            <b>Tutorial</b>
          </Button>
        </Link>
        <Link as={RouterLink} to="/FAQ" ml="8">
          <Button colorScheme="white" variant="solid" color="black" fontSize="1.4em" fontWeight="light" size="lg" height="63" px="6">
            <b>FAQ</b>
          </Button>
        </Link>
        <Link as={RouterLink} to="/contributors" ml="8">
          <Button colorScheme="white" variant="solid" color="black" fontSize="1.4em" fontWeight="light" size="lg" height="63" px="6">
            <b>Contributors</b>
          </Button>
        </Link>

      </Flex>
      <Menu>
        <MenuButton
          as={IconButton}
          icon={<Avatar size="sm"/>}
          boxShadow="lg"
        >
        </MenuButton>
        <MenuList>
          {authenticated ? (
            <>
              <MenuItem as={RouterLink} to="/userInfo">View Profile</MenuItem>
              <MenuItem onClick={logout}>Logout</MenuItem>
            </>
          ) : (
            <MenuItem onClick={loginWithRedirect}>Login</MenuItem>
          )}
        </MenuList>
      </Menu>
    </Flex>
  );
};

export default NavBar;