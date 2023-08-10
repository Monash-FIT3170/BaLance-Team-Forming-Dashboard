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
    FormControl,
    FormLabel,
    FormHelperText,
} from '@chakra-ui/react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowBackIcon } from '@chakra-ui/icons';

function CreateGroups() {
    const [strategy, setStrategy] = useState("random");
    const [groupSize, setGroupSize] = useState(2);
    const [variance, setVariance] = useState(1);
    const cancelRef = React.useRef();
    const navigate = useNavigate();
    const {
        isOpen,
        onOpen,
        onClose
    } = useDisclosure();
    const { unitCode, year, period } = useParams();
    const groupDetails = {
        "strategy": strategy,
        "groupSize": groupSize,
        "variance": variance
    }

    const handleSubmitGroupOptions = async (event) => {
        event.preventDefault();
        navigateToOfferingDashboard();

        /* Call to shuffle groups */
        fetch(`http://localhost:8080/api/groups/shuffle/${unitCode}/${year}/${period}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                groupSize: groupSize,
                variance: variance,
                strategy: strategy,
            })
        })
            .catch((error) => { console.error('Error:', error); })

        /* Creating new groups */
        /*
        await fetch(`http://localhost:8080/api/groups/${unitCode}/${year}/${period}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                groupSize: groupSize,
                variance: variance,
                strategy: strategy
            })
        });
        */
    }

    const navigateToOfferingDashboard = () => {
        navigate(`/groups/${unitCode}/${year}/${period}`);
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


            <VStack margin="3vh 5vw">
                <form id="create-groups" onSubmit={handleSubmitGroupOptions} w="100%">

                    <FormControl isRequired>
                        <HStack w="100%">
                            <Box fontSize="19" w="40vw">
                                <Text fontWeight="semibold">Step 1: Select a strategy</Text>
                                <Text>Choose a strategy for how the groups will be determined and allocated.</Text>
                                <Text>Note: for any strategy other than “random”, please ensure that each student in the offering has an entry for the relevant data points.</Text>
                                <Text>Random - None required</Text>
                                <Text>WAM based - WAM_VAL and DEDICATED_HOURS</Text>
                                <Text>Belbin based - BELBIN_TYPE</Text>
                            </Box>
                            <Spacer width="15vw" />
                            <VStack>
                                <FormLabel>Strategy</FormLabel>
                                <Select marginLeft="5vw" w="12vw" placeholder='' onChange={(event) => setStrategy(event.target.value)}>
                                    <option value='random'>Random Strategy</option>
                                    <option value='effort'>WAM Based Strategy</option>
                                    <option value='belbin'>Belbin Based Strategy</option>
                                </Select>
                            </VStack>
                        </HStack>

                        <Divider marginY="1vh" />

                        <HStack w="100%">
                            <Box fontSize="19" w="40vw">
                                <Text fontWeight="semibold">Step 2: Select an ideal group size</Text>
                                <Text>Choose the ideal size for each group.</Text>
                                <Text>Note: it is possible that not all of the groups are the ideal size, depending on the number of students in the offering.</Text>
                            </Box>
                            <Spacer />
                            <VStack>
                                <FormLabel>Group Size</FormLabel>
                                <NumberInput w="12vw" min="2" defaultValue="2" onChange={(valueString) => setGroupSize(parseInt(valueString))}>
                                    <NumberInputField />
                                    <NumberInputStepper>
                                        <NumberIncrementStepper />
                                        <NumberDecrementStepper />
                                    </NumberInputStepper>
                                </NumberInput>
                                <FormHelperText>Minimum group size is 2</FormHelperText>
                            </VStack>
                        </HStack>

                        <Divider marginY="1vh" />

                        <HStack w="100%">
                            <Box fontSize="19" w="40vw">
                                <Text fontWeight="semibold">Step 3: Select a variance value (recommended 1)</Text>
                                <Text>Choose how big or small you would like the variance in group size to be.</Text>
                                <Text>We recommend this value to be 1.</Text>
                            </Box>
                            <Spacer />
                            <VStack>
                                <FormLabel>Variance</FormLabel>
                                <NumberInput w="12vw" min="1" defaultValue="1" onChange={(valueString) => setVariance(parseInt(valueString))}>
                                    <NumberInputField />
                                    <NumberInputStepper>
                                        <NumberIncrementStepper />
                                        <NumberDecrementStepper />
                                    </NumberInputStepper>
                                </NumberInput>
                                <FormHelperText>Minimum variance is 1</FormHelperText>
                            </VStack>
                        </HStack>
                    </FormControl>
                    <Divider marginY="1vh" />
                </form>


                <Button type="submit" form="create-groups" colorScheme="blue" >Assign Groups</Button>
            </VStack>

        </>


    );

}

export default CreateGroups;
