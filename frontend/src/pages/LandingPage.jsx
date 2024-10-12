import {
    Container,
    Heading,
    Flex,
    Stack,
    Text,
    Button,
    Box,
    Image,
    Link
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { MockAuth } from '../helpers/mockAuth';
import logo from '../assets/logo.png';
import LoadingSpinner from '../components/_shared/LoadingSpinner';
function LandingPage() {
    let authService = {
        DEV: MockAuth,
        TEST: useAuth0,
      };
    
    const { isAuthenticated,isLoading, loginWithRedirect, logout } = authService[import.meta.env.VITE_REACT_APP_AUTH]();
    if(isLoading){
        return (<LoadingSpinner/>)
    }
    return (
        <Container maxW={'7xl'}>
            <Stack
                align={'center'}
                spacing={{ base: 8, md: 10 }}
                py={{ base: 20, md: 28 }}
                direction={{ base: 'column', md: 'row' }}>
                <Stack flex={1} spacing={{ base: 5, md: 10 }}>
                    <Heading
                        lineHeight={1.1}
                        fontWeight={600}
                        fontSize={'4xl'}>
                        <Text
                            as={'span'}
                            position={'relative'}
                            _after={{
                                content: "''",
                                width: 'full',
                                height: '30%',
                                position: 'absolute',
                                bottom: 1,
                                left: 0,
                                bg: 'yellow.400',
                                zIndex: -1
                            }}>
                            Take the stress out of team formation
                        </Text>
                        <br />
                        <Text as={'span'} color={'yellow.400'}>
                            and build well BaLanced teams with us!
                        </Text>
                    </Heading>
                    <Text color={'gray.500'}>
                        BaLance is a tool for teaching associates to split student
                        cohorts into well balanced teams that gel well together and
                        work productively.
                    </Text>
                    <Text color={'gray.500'}>
                        It makes use of student personality data to determine the
                        optimal team formations and provides a variety of team
                        formation strategies for teaching associates to select from.

                    </Text>
                    <Stack
                        spacing={{ base: 4, sm: 6 }}
                        direction={{ base: 'column', sm: 'row' }}>
                        <Link as={RouterLink} to="/home" ml="8">
                            <Button
                                rounded={'full'}
                                size={'lg'}
                                fontWeight={'normal'}
                                px={6}
                                colorScheme={'yellow'}
                                bg={'yellow.400'}
                                _hover={{ bg: 'yellow.500' }}>
                                Get Started
                            </Button>
                        </Link>
                        <Flex>
                            {isAuthenticated ? (
                                <Button onClick={logout} height="8vh" width="14vh" maxHeight="2.6em" minHeight="1.8em" maxWidth="6.5em" minWidth="4.3em" boxShadow="lg">Logout</Button>
                            ) : (
                                <Button onClick={()=> loginWithRedirect()}>
                                Login
                                </Button>
                            )}
                        </Flex>
                    </Stack>
                </Stack>
                <Flex
                    flex={1}
                    justify={'center'}
                    align={'center'}
                    position={'relative'}
                    w={'full'}>
                    <Box
                        position={'relative'}
                        height={'300px'}
                        rounded={'2xl'}
                        boxShadow={'2xl'}
                        overflow={'hidden'}>
                        <Image
                            src={logo}
                            fit={'cover'}
                            align={'center'}
                            w={'100%'}
                            h={'100%'}
                        />
                    </Box>
                </Flex>
            </Stack>
        </Container>
    )
}

export default LandingPage;