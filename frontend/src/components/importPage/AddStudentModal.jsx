import { useAuth0 } from "@auth0/auth0-react";
import { useState } from "react";
import { AddIcon } from "@chakra-ui/icons";
import {
    Button,
    FormControl,
    HStack,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Spacer,
    Text,
    VStack,
    useDisclosure,
    useToast
} from "@chakra-ui/react";

import { MockAuth } from "../../helpers/mockAuth";
import TextField from "../_shared/TextField";
import Dropdown from "../_shared/Dropdown";
import NumberField from "../_shared/NumberField";
import getToastSettings from "../_shared/ToastSettings";



const AddStudentModal = ({unitCode, unitYear, unitPeriod}) => {

    const { isOpen, onOpen, onClose } = useDisclosure()

    const toast = useToast();
    const getToast = (title, status) => {
        toast.closeAll();
        toast(getToastSettings(title, status))
    }

    let authService = {
        "DEV": MockAuth,
        "TEST": useAuth0
    }
    const { getAccessTokenSilently } = authService[process.env.REACT_APP_AUTH]();

    const [studentID, setStudentID] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [wam, setWam] = useState(50);
    const [labID, setLabID] = useState('');
    const [gender, setGender] = useState('None Selected');

    const validateWam = (wam) => {
        return wam >= 0 && wam <= 100;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!studentID || !firstName || !lastName || !email || !wam || !labID || !gender) {
            // all fields must be filled error toast
            getToast("Please ensure that all fields are filled out before resubmitting.", "error")
        }
        else if (!validateWam(wam)) {
            // wam error toast
            getToast("The WAM value must be an integer between 0 and 100.", "error")
        }
        else {
            console.log("Adding profile: ", studentID, firstName, lastName, email, wam, labID, gender);
            getAccessTokenSilently().then((token) => {
                
                fetch(`http://localhost:8080/api/students/${unitCode}/${unitYear}/${unitPeriod}`, {
                    method: 'POST',
                    headers: new Headers({
                        Authorization: `Bearer ${token}`,
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                    }),
                    body: JSON.stringify([{
                        studentId:studentID, 
                        labCode:labID,
                        lastName:lastName,
                        preferredName:firstName,
                        email:email,
                        gender:gender,
                        wam:wam
                    }]),
                })
                    .then((response) => {
                        if (!response.ok) {
                            getToast('There was an error uploading your student!', 'error');
                            throw new Error('Error sending data to the REST API');
                        } else {
                            getToast('Your student has been uploaded successfully!', 'success');
                        }
                    })
                    .catch((error) => {
                        console.error('Error sending data to the REST API:', error);
                        // Handle the error from the API if needed
                    });
            });
            onClose();
        }
    };

    return (
        <>
            <Button
                width='80%'
                onClick={onOpen}
                colorScheme="gray"
                margin-left="20">
                <HStack>
                    <AddIcon />
                    <Spacer />
                    <Text>Manually add an entry</Text>
                </HStack>
            </Button>

            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>
                        Add a Student Profile
                    </ModalHeader>

                    <ModalBody>
                        <form id="create-student" onSubmit={handleSubmit}>
                            <br />
                            <FormControl required>
                                <TextField
                                    my={10}
                                    label="Student ID"
                                    value={studentID}
                                    onChange={(event) => { setStudentID(event.target.value) }}
                                />
                                <TextField
                                    label="First Name"
                                    value={firstName}
                                    onChange={(event) => { setFirstName(event.target.value) }}
                                />
                                <TextField
                                    label="Last Name"
                                    value={lastName}
                                    onChange={(event) => { setLastName(event.target.value) }}
                                />
                                <TextField
                                    label="Email Address"
                                    value={email}
                                    onChange={(event) => { setEmail(event.target.value) }}
                                />
                                <TextField
                                    label="Lab ID"
                                    value={labID}
                                    onChange={(event) => { setLabID(event.target.value) }}
                                />
                                <VStack>
                                    <HStack>
                                        <Text>
                                            WAM Value:
                                        </Text>
                                        <NumberField
                                            defaultValue={wam}
                                            minValue={0}
                                            label="Weighted Average Mark"
                                            value={wam}
                                            onChange={(event) => { setWam(event) }}
                                        />
                                    </HStack>

                                    <HStack>
                                        <Text>
                                            Select a Gender:
                                        </Text>
                                        <Dropdown
                                            placeholder={gender}
                                            label="Gender"
                                            options={['M', 'F']}
                                            onChange={(event) => { setGender(event.target.value) }}
                                        />
                                    </HStack>

                                </VStack>

                            </FormControl>
                        </form>
                    </ModalBody>

                    <ModalFooter>
                        <Button onClick={onClose} text="Close">Cancel</Button>
                        <Button type="submit" colorScheme="blue" ml={3} onClick={handleSubmit}>Submit</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>

    );
};

export default AddStudentModal;
