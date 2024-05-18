import {
    Container,
    Heading,
    Flex,
    Stack,
    Text,
    Button,
    Box,
    Image
} from '@chakra-ui/react';

import logo from '../assets/logo.png';
function LandingPage() {
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
                        <Button
                            rounded={'full'}
                            size={'lg'}
                            fontWeight={'normal'}
                            px={6}>
                            Another button
                        </Button>
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