import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router';
import { useAuth0 } from '@auth0/auth0-react';
import { useNavigate } from 'react-router-dom';
import { ArrowBackIcon } from '@chakra-ui/icons';
import {
    Select,
    Button,
    HStack,
    Spacer,
    Center,
    useDisclosure,
    Text,
    VStack,
    Box,
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

import { MockAuth } from '../helpers/mockAuth';
import PageHeader from "../components/_shared/PageHeader";
import Dropdown from "../components/_shared/Dropdown";
import NavButton from "../components/_shared/NavButton";
import getToastSettings from '../components/_shared/ToastSettings';
import ToggleButtonGroup from "../components/_shared/ToggleButtonGroup";

function CreateGroups() {
    let authService = {
        "DEV": MockAuth,
        "TEST": useAuth0
    }

    const { getAccessTokenSilently } = authService[process.env.REACT_APP_AUTH]();
    const [students, setStudents] = useState([]);
    const [strategy, setStrategy] = useState("random");
    const [groupSize, setGroupSize] = useState(2);
    const navigate = useNavigate();

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

    const navigateUploadScript = () => {
        navigate();
    };

    useEffect(() => {
        getAccessTokenSilently().then((token) => {
            // fetch students from the backend
            fetch(`http://localhost:8080/api/students/${unitCode}/${year}/${period}`,
                {
                    method: 'get',
                    headers: new Headers({
                        'Authorization': `Bearer ${token}`
                    })
                })
                .then((res) => res.json())
                .then((res) => {
                    setStudents(res);
                    console.log(students)
                })
                .catch((err) => console.error(err));
        })
    }, []);

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
        } else if (groupSize === 0) { 
            getToast("Failed to create groups. You cannot have a group size of 0.", "error");
            return;
        }
        else if (groupSize > students.length) {
            getToast(`Failed to create groups. The maximum ideal group size is ${students.length}`, "error");
            return;
        }
        else {
            /* Call to shuffle groups */
            await fetch(`http://localhost:8080/api/groups/shuffle/${unitCode}/${year}/${period}`, {
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
                .catch((error) => { console.error('Error:', error); });
                        // fetch groups from the backend
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

                <Button
                    type="submit"
                    form="create-groups"
                    colorScheme="blue"
                >
                    Assign groups
                </Button>
            </VStack>
        </div>
    );
}

export default CreateGroups;
