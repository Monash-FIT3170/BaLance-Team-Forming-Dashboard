import { useAuth0 } from '@auth0/auth0-react';
import {
    Image,
    Container,
    Button,
    Box,
    HStack,
    Link
} from '@chakra-ui/react';

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
            zIndex={999}
        >
            <HStack w="100%">
                <Box width='40%'/>
                <Link href='/'>
                    <Image
                        height={{
                            base:"2em",
                            md: "4em"
                        }}
                        src={logo}
                        alt="BaLance: Team Forming Dashboard"
                    />
                </Link>
                <Box width='30%'/>

                {authenticated ? (
                    <Button
                        onClick={logout}
                        h="3em"
                        w='6em'
                    >
                        Logout
                    </Button>
                ) : (
                    <Button
                        onClick={loginWithRedirect}
                        h="3em"
                        w='6em'
                    >
                        Login
                    </Button>
                )}

            </HStack>
        </Container>
    );
}

export default NavBar;