import {useState} from 'react';
import {
    FormControl,
    FormLabel,
    Modal,
    ModalBody,
    ModalContent,
    ModalCloseButton,
    ModalHeader,
    ModalOverlay,
    useToast
} from "@chakra-ui/react";

import {TextField, InputNumber, Dropdown, MultipleDropdown} from "../../_shared";
import ModalFooterButtonPair from "../../_shared/ModalFooterButtonPair";

const AddTimeModalBody = ({isOpen, onClose, profilesList,setProfileList }) => {
    const [studentID, setStudentID] = useState('');
    const [projectCount, setProjectCount] = useState(5); 
    const [projectID, setProjectID] = useState('');
    const [preferenceID, setPreferenceID] = useState('');
    const [timeStamp, setTimeStamp] = useState('');
    const toast = useToast();
    const successMsg = "Added time preference result to the list of profiles for submission";
    const [options, setOptions] = useState([1,2,3,4,5]);

    const closeModal = () => {
        setStudentID('');
        setProjectID('');
        setPreferenceID('');
        setProjectCount('');
        setTimeStamp('');
        onClose()
    }

    const validateFields = () => {
        console.log("This is a console.log message");
        const errors = [];

        if (studentID.length === 0) {
            errors.push('student ID must be provided')
        } else if (studentID.search(/^[0-9]{8}$/) === -1) {
            errors.push('student ID must be an 8 digit number')
        }

        // Number of projects 
        if (projectCount === ''){
            errors.push('Project count must be provided')
        } else if (projectCount.search(/^[0-9]{1,3}$/) === -1){
            errors.push('Project Count must be greater than 0')
        }

        // Validate project ID
        if (projectID === '') {
            errors.push('Project ID must be provided');
        } else if (parseInt(projectID) < 0 || parseInt(projectID) > MAX_PROJECT_ID) {
            errors.push('Project ID must be a number between 0 and ' + MAX_PROJECT_ID);
        }

        // Validate preference ID
        if (preferenceID === '') {
            errors.push('Preference ID must be provided');
        } else if (parseInt(preferenceID) < 0 || parseInt(preferenceID) > parseInt(projectCount)) {
            errors.push('Preference ID must be a number between 0 and ' + projectCount);
        }

        // Validate timestamp
        if (timeStamp === '') {
            errors.push('Timestamp must be provided');
        } else {
            // Check if the timestamp is a valid date format
            const isValidTimestamp = !isNaN(Date.parse(timeStamp));
            if (!isValidTimestamp) {
                errors.push('Timestamp must be a valid date format');
            }
        }
    }

    const handleSubmit = () => {
        const errors = validateFields();

        if (errors.length > 0) {
            errors.forEach((errorMsg) =>
                toast({
                    title: 'Input error',
                    description: errorMsg,
                    status: 'error',
                    duration: 4000,
                    isClosable: true,
                })
            )
            return
        }

        const newProfile = {
            studentId: studentID,
            projectCount: projectCount,
            preferenceID: preferenceID
        }

        setProfilesList([...profilesList, newProfile]);

        toast({
            title: 'Profile added',
            description: successMsg,
            status: 'success',
            duration: 4000,
            isClosable: true,
        })

        closeModal()


    }

    const changeProjectCount = (event) => {
        setProjectCount(parseInt(event));
        
        console.log("Project count: " + projectCount + "\n");
        console.log("event: " +event+"\n");

        let numbers = [];

        for (let i = 0; i <= event; i++) {
            numbers.push(i);
        }
        setOptions(numbers);
        return;
    }

    return(
        <Modal isOpen={isOpen} onClose={closeModal}>
            <ModalOverlay />
            <ModalContent>
                <ModalCloseButton />
                <ModalHeader>Add a Time Preference Result</ModalHeader>
                <ModalBody>
                    <FormControl isRequired>
                        <TextField
                            label="Student ID"
                            value={studentID}
                            onChange={(event) => { setStudentID(event.target.value); }}
                        />
                        <InputNumber 
                            label="Number of Projects"
                            defaultValue={5}
                            min={0}
                            value={projectCount}
                            onChange={(event) => { changeProjectCount(event);}}
                        />
                        <FormLabel>Preference for project 1</FormLabel>
                        <Dropdown 
                            placeholder={'select'}
                            required={true}
                            options={options}
                            onChange={(event) => { setPreferenceID(event.target.value);}}
                        />
                        <MultipleDropdown labelText={'project pref'}/>
                        <TextField
                            label="Project ID"
                            value={projectID}
                            onChange={(event) => { setProjectID(event.target.value); }}
                        />
                        <TextField
                            label="Preference ID"
                            value={preferenceID}
                            onChange={(event) => { setPreferenceID(event.target.value); }}
                        />
                        <TextField
                            label="Timestamp"
                            value={timeStamp}
                            onChange={(event) => { setTimeStamp(event.target.value); }}
                        />
                    </FormControl>
                </ModalBody>
                <ModalFooterButtonPair
                    cancelButtonText={'Cancel'}
                    cancelButtonColor={'red'}
                    cancelButtonOnClick={closeModal}
                    confirmButtonText={'Submit'}
                    confirmButtonColor={'blue'}
                    confirmButtonOnClick={handleSubmit}
                />
            </ModalContent>
        </Modal>
    )
};

export default AddTimeModalBody;

