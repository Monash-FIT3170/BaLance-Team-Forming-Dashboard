import { useParams } from 'react-router';
import { useAuth0 } from '@auth0/auth0-react';
import { useNavigate } from 'react-router-dom';
import { ArrowBackIcon } from '@chakra-ui/icons';
import {useEffect, useState} from 'react';
import {
    Button,
    VStack,
    Box,
    NumberInput,
    NumberInputField,
    NumberIncrementStepper,
    NumberInputStepper,
    NumberDecrementStepper,
    FormControl,
    FormLabel,
    FormHelperText,
    useToast
} from '@chakra-ui/react';

import { MockAuth } from '../helpers/mockAuth';
import PageHeader from "../components/_shared/PageHeader";
import Dropdown from "../components/_shared/Dropdown";
import NavButton from "../components/_shared/NavButton";
import ToggleButtonGroup from "../components/_shared/ToggleButtonGroup";

function CreateGroups() {
    const authService = { "DEV": MockAuth, "TEST": useAuth0}
    const { getAccessTokenSilently } = authService[process.env.REACT_APP_AUTH]();
    const { unitCode, year, period } = useParams();
    const [strategy, setStrategy] = useState("random");
    const [groupSize, setGroupSize] = useState(2);
    const [viableStrats, setViableStrats] = useState({
        "belbin": false,
        "effort": false
    })
    const navigate = useNavigate();
    const toast = useToast()

    const fetchGroupFormationParameters = async () => {
        /**
         * fetches key values that determine how a group can be formed
         * and are used to validate user selections
         *
         */

        try {
            console.log("fetching strategies we can use")
            const token = await getAccessTokenSilently();
            const groupingStratsResponse = await fetch(
                `http://localhost:8080/api/units/groupingStrategies/${unitCode}/${year}/${period}`, {
                    method: 'GET',
                    headers: new Headers({
                        'Authorization': `Bearer ${token}`,
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    })
                })

            const groupingStrats = await groupingStratsResponse.json()
            console.log(groupingStrats)
            setViableStrats(groupingStrats);

        } catch (e) {
            console.error(e);
            toast({
                description: 'Strategies other than random are currently not available',
                status: "info",
                duration: "5000",
                isClosable: true
            });
        }
    }

    useEffect(() => {fetchGroupFormationParameters()}, [])

    const validateFields = () => {
        /**
         * checks if the current values selected for group formation are valid
         * and stores any errors as strings in an array to be returned
         *
         */

        const errors = []
        // does the selected field contain associated data
        if (!viableStrats[strategy] && strategy !== "random") {
            errors.push(`cannot form groups using ${strategy}: ${strategy} data has not been uploaded`);
        }

        // is an appropriate group size selected

        return errors;
    }

    const assignGroups = async (event) => {
        event.preventDefault();
        const errors = validateFields();
        if (errors.length > 0) {
            errors.forEach((errorMsg) => {
                toast({
                    title: 'Input error',
                    description: errorMsg,
                    status: 'error',
                    duration: 4000,
                    isClosable: true,
                })
            })
            return
        }

        let result;

        try {
            const token = await getAccessTokenSilently();
            result = await fetch(
                `http://localhost:8080/api/groups/shuffle/${unitCode}/${year}/${period}`, {
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
        } catch (e) {
            console.error(e);
            toast({
                title: "Network error",
                description: 'Could not connect to the server :(',
                status: "error",
                duration: "3000",
                isClosable: true
            });

            return;
        }

        if (result.ok) {
            toast({
                title: "Groups created!",
                description: `Successfully created groups using ${strategy} strategy`,
                status: "success",
                duration: "3000",
                isClosable: true
            })
            navigate(`/groups/${unitCode}/${year}/${period}`);
        } else {
            // const error = await result.json() todo pull error msg from backend
            toast({
                title: "error",
                description: 'We could not form groups',
                status: "error",
                duration: "3000",
                isClosable: true
            })
        }
    }

    return (
        <div>
            <PageHeader
                fontSize={"2xl"}
                pageDesc={`Configure groups: ${unitCode} ${period} ${year}`}
            />

            <VStack>
                <NavButton
                    buttonIcon={<ArrowBackIcon />}
                    buttonText="Return to offering dashboard"
                    buttonUrl={`/students/${unitCode}/${year}/${period}`}
                />

                <Box h='1em'/>
                <ToggleButtonGroup
                    leftButtonIsDisabled={true}
                    leftButtonUrl={`/createGroups/${unitCode}/${year}/${period}`}
                    leftButtonText='in-built strats'
                    rightButtonIsDisabled={false}
                    rightButtonUrl={`/uploadGroupScript/${unitCode}/${year}/${period}`}
                    rightButtonText='custom scripts'
                />
            </VStack>

            <VStack m='2em'>
                <FormControl isRequired mb='1em'>
                    <VStack>
                        <FormLabel ml='1em'>Group Formation Strategy</FormLabel>
                        <Dropdown
                            options={['random', 'effort', 'belbin']}
                            width='12em'
                            onChange={(event) => setStrategy(event.target.value)}
                        />

                        <FormLabel>Group Size</FormLabel>

                        <NumberInput w="12em" min={strategy === "belbin" ? "3" : "2"} defaultValue={strategy === "belbin" ? "3" : "2"} onChange={(valueString) => setGroupSize(parseInt(valueString))}>
                            <NumberInputField/>
                            <NumberInputStepper>
                                <NumberIncrementStepper/>
                                <NumberDecrementStepper/>
                            </NumberInputStepper>
                        </NumberInput>

                        <FormHelperText>Minimum group size is {strategy === "belbin" ? "3" : "2"}</FormHelperText>
                    </VStack>
                </FormControl>

                <Button type="submit" colorScheme="blue" onClick={assignGroups}>
                    Assign groups
                </Button>
            </VStack>
        </div>
    );
}

export default CreateGroups;
