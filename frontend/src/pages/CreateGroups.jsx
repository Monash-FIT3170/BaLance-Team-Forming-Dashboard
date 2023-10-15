import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import { useAuth0 } from '@auth0/auth0-react';

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
    useToast,
} from '@chakra-ui/react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowBackIcon } from '@chakra-ui/icons';
import { MockAuth } from '../helpers/mockAuth';
import PageHeader from "../components/shared/PageHeader";
import DropdownDynamic from "../components/shared/DropdownDynamic";
import NavButton from "../components/shared/NavButton";
import getToastSettings from '../components/shared/ToastSettings';

function CreateGroups() {
    let authService = {
        "DEV": MockAuth,
        "TEST": useAuth0
    }

    const { getAccessTokenSilently } = authService[process.env.REACT_APP_AUTH]();

    const [strategy, setStrategy] = useState("random");
    const [groupSize, setGroupSize] = useState(2);
    const cancelRef = React.useRef();
    const navigate = useNavigate();
    const {
        isOpen,
        onOpen,
        onClose
    } = useDisclosure();
    const toast = useToast();
    const getToast = (title, status) => {
        toast.closeAll();
        toast(getToastSettings(title, status))
    }
    const { unitCode, year, period } = useParams();
    const groupDetails = {
        "groupSize": groupSize,
    }

    const navigateToOfferingDashboardGroups = () => {
        navigate(`/groups/${unitCode}/${year}/${period}`);
    };

    const navigateToOfferingDashboardStudents = () => {
        navigate(`/students/${unitCode}/${year}/${period}`);
    };

    const navigateUploadScript = () => {
        navigate(`/uploadGroupScript/${unitCode}/${year}/${period}`);
    };

    const handleSubmitGroupOptions = async (event) => {
        event.preventDefault();

        const token = await getAccessTokenSilently();

        if (strategy === "custom") {
            navigateUploadScript();
            navigate(
                `/uploadGroupScript/${unitCode}/${year}/${period}`,
                { state: { groupDetails } });
        } 
        else if (strategy === "belbin" && groupSize === 2) {
            getToast("Failed to create groups. The minimum ideal group size for the belbin grouping strategy is 3.", "error");
            return;
        }
        
        else {
            /* Call to shuffle groups */
            fetch(`http://localhost:8080/api/groups/shuffle/${unitCode}/${year}/${period}`, {
                method: 'POST',
                headers: new Headers({
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }),
                body: JSON.stringify({
                    groupSize: groupSize,
                    strategy: strategy,
                })
            })
                .then((res) => {
                    if (res.status === 200) {
                        getToast("Groups created successfully", "success");
                        navigateToOfferingDashboardGroups();
                    } else {
                        res.json().then(json => console.log(json))
                    }
                })
                .catch((error) => { console.error('Error:', error); })
        }
    }

    return (
        <>
            <PageHeader
                fontSize={"2xl"}
                pageDesc={`Configure groups: ${unitCode} ${period} ${year}`}
            />

            <Center>
                <NavButton
                    buttonIcon={<ArrowBackIcon />}
                    buttonText="Return to offering dashboard"
                    buttonUrl={`/students/${unitCode}/${year}/${period}`}
                />
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
                                <Text>WAM based - hourCommitment, avgAssignmentMark</Text>
                                <Text>Belbin based - belbinType</Text>
                            </Box>
                            <Spacer width="15vw" />
                            <VStack>
                                <FormLabel>Strategy</FormLabel>
                                {/* FIXME refactor as DynamicDropdown component */}
                                <Select marginLeft="5vw" w="12vw" placeholder='' onChange={(event) => setStrategy(event.target.value)}>
                                    <option value='random'>Random Strategy</option>
                                    <option value='effort'>WAM Based Strategy</option>
                                    <option value='belbin'>Belbin Based Strategy</option>
                                    <option value='custom'>Custom Script</option>
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

                                <NumberInput w="12vw" min={strategy === "belbin" ? "3" : "2"} defaultValue={strategy === "belbin" ? "3" : "2"} onChange={(valueString) => setGroupSize(parseInt(valueString))}>
                                    <NumberInputField />
                                    <NumberInputStepper>
                                        <NumberIncrementStepper />
                                        <NumberDecrementStepper />
                                    </NumberInputStepper>
                                </NumberInput>


                                <FormHelperText>Minimum group size is {strategy === "belbin" ? "3" : "2"}</FormHelperText>
                            </VStack>
                        </HStack>



                    </FormControl>
                    <Divider marginY="1vh" />
                </form>


                <Button type="submit" form="create-groups" colorScheme="blue" >{strategy === "custom" ? "Upload Custom Script" : "Assign group"}</Button>
            </VStack>

        </>


    );

}

export default CreateGroups;
