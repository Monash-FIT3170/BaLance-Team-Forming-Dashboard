import { useAuth0 } from '@auth0/auth0-react';
import { Image, Container, Button, Box, Flex, Spacer, Link } from '@chakra-ui/react';

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
    <Container
      as="header"
      pos="fixed"
      top={0}
      left={0}
      w="100%"
      display="flex"
      p="5"
      maxH="8em"
      minW="100vw"
      bgColor="balance.header_color"
      centerContent
      overflow="hidden"
      zIndex={999}
    >
      <Flex
          w="100%"
          justify="space-between"
          align="center"
          pl="1em" >
          <Box display="flex" alignItems="center">
              <Link href={'/'}>
                  <Image
                      height={{
                          base: "3em",
                          md: "4em"
                      }}
                      src={logo}
                      alt="BaLance: Team Forming Dashboard"
                  />
              </Link>
          </Box>
          <Box paddingLeft={10}>
          <Link href='/FAQ/'>
            <Button colorScheme="gray" variant = "ghost"  h="3em" w="6em" fontSize={20}>
              FAQ
            </Button>
          </Link>
        </Box>
        <Spacer />
        <Spacer />
        {authenticated ? (
          <Button onClick={logout} h="3em" w="6em">
            Logout
          </Button>
        ) : (
          <Button onClick={loginWithRedirect} h="3em" w="6em">
            Login
          </Button>
        )}
      </Flex>
    </Container>
  );
};

export default NavBar;
