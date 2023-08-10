import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import {
    Table,
    Thead,
    Select,
    Tr,
    Th,
    Tbody,
    Button,
    ButtonGroup,
    HStack,
    Spacer,
    Heading,
    Center,
    useDisclosure,
    Text,
    VStack,
    Box,
    Container,
    Divider,
    NumberInput,
    NumberInputField,
    NumberIncrementStepper,
    NumberInputStepper,
    NumberDecrementStepper,
} from '@chakra-ui/react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowBackIcon } from '@chakra-ui/icons';

function CreateGroups() {
    const [strategy, setStrategy] = useState("");
    const [groupSize, setGroupSize] = useState(-1);
    const [variance, setVariance] = useState(-1);
    const cancelRef = React.useRef();
    const navigate = useNavigate();
    const {
        isOpen,
        onOpen,
        onClose
    } = useDisclosure();
    const { unitCode, year, period } = useParams();


    const navigateToOfferingDashboard = () => {
        navigate(`/students/${unitCode}/${year}/${period}`);
    };

    return (
        <>
            <Box as="header" p="4" textAlign="center">
                <Text fontSize="2xl" fontWeight="bold">
                    {`${unitCode} - ${period} ${year}, **CAMPUS**`}
                </Text>
            </Box>

            <Center>
                <Button onClick={navigateToOfferingDashboard}>
                    <HStack>
                        <ArrowBackIcon />
                        <Spacer />
                        <Text>Return to offering dashboard</Text>
                    </HStack>
                </Button>
            </Center>

            <VStack margin="5vh 5vw">
                <HStack w="80%">
                    <Box fontSize="19" maxW="40vw">
                        <Text fontWeight="semibold">Step 1: Select a strategy</Text>
                        <Text>Choose a strategy for how the groups will be determined and allocated.</Text>
                        <Text>Note: for any strategy other than “random”, please ensure that each student in the offering has an entry for the relevant data points.</Text>
                        <Text>Random - None required</Text>
                        <Text>WAM based - WAM_VAL and DEDICATED_HOURS</Text>
                        <Text>Belbin based - BELBIN_TYPE</Text>
                    </Box>
                    <Spacer />
                    <Select maxW="15vw" placeholder='Strategy'>
                        <option value='option1'>Random Strategy</option>
                        <option value='option2'>WAM Based Strategy</option>
                        <option value='option3'>Belbin Based Strategy</option>
                    </Select>
                </HStack>
                <Divider />
                <HStack w="80%">
                    <Box fontSize="19" maxW="40vw">
                        <Text fontWeight="semibold">Step 2: Select an ideal group size</Text>
                        <Text>Choose the ideal size for each group.</Text>
                        <Text>Note: it is possible that not all of the groups are the ideal size, depending on the number of students in the offering.</Text>
                    </Box>
                    <Spacer />
                    <NumberInput min="2" defaultValue="2">
                        <NumberInputField />
                        <NumberInputStepper>
                            <NumberIncrementStepper />
                            <NumberDecrementStepper />
                        </NumberInputStepper>
                    </NumberInput>
                </HStack>
                <Divider />
                <HStack w="80%">
                    <Box fontSize="19" maxW="40vw">
                        <Text fontWeight="semibold">Step 3: Select a variance value (recommended 1)</Text>
                        <Text>Choose how big or small you would like the variance in group size to be.</Text>
                        <Text>We recommend this value to be 1.</Text>
                    </Box>
                    <Spacer />
                    <NumberInput min="1" defaultValue="1">
                        <NumberInputField />
                        <NumberInputStepper>
                            <NumberIncrementStepper />
                            <NumberDecrementStepper />
                        </NumberInputStepper>
                    </NumberInput>
                </HStack>
                <Divider />
                <Button colorScheme="blue" onClick={navigateToOfferingDashboard}>Assign Groups</Button>
            </VStack>

        </>


    );

}

export default CreateGroups;
