import { useAuth0 } from '@auth0/auth0-react';
import {
    Image,
    Container,
    Button,
    Box,
    Flex,
} from '@chakra-ui/react';
import { Link } from 'react-router-dom'; // This is to avoid page refreshes, smoother experience (when returning to Landing Page).

import { MockAuth } from '../../helpers/mockAuth';
import logo from '../../assets/logo_separated.png';

const NavBar = ({ authenticated }) => {
    let authService = {
        "DEV": MockAuth,
        "TEST": useAuth0
    }

    const { loginWithRedirect, logout } = authService[process.env.REACT_APP_AUTH]();


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
            zIndex={999}>
            <Flex
                w="100%"
                justify="space-between"
                align="center"
                pl="1em" >
                <Box display="flex" alignItems="center">
                    <Link to="/">
                        <Image
                            height={{
                                base: "3em",
                                md: "4em"
                            }}
                            src={logo}
                            alt="BaLance: Team Forming Dashboard"
                        />
                    </Link>
                    <Button
                        as={Link} 
                        to="/home"
                        h="5em"
                        w='8em'
                        ml="15px"
                        style={{
                            marginLeft: "40px", 
                        }}>
                        Home
                    </Button>
                </Box>
                <Box>
                    {authenticated ? (
                        <Button
                            onClick={logout}
                            h="5em"
                            w='8em'
                            ml="15px">
                            Logout
                        </Button>
                    ) : (
                        <Button
                            onClick={loginWithRedirect}
                            h="5em"
                            w='8em'
                            ml="15px">
                            Login
                        </Button>
                    )}
                </Box>
            </Flex>
        </Container>
    );
}

export default NavBar;