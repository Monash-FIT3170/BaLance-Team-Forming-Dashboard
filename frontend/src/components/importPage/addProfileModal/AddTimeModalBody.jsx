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

import {TextField, Dropdown, InputNumber} from "../../_shared";
import ModalFooterButtonPair from "../../_shared/ModalFooterButtonPair";

const AddTimeModalBody = ({isOpen, onClose, profilesList, setProfilesList}) => {
    const [studentID, setStudentID] = useState('');
    const [projectCount, setProjectCount] = useState(5); 
    const [options, setOptions] = useState([1,2,3,4,5]);
    const [preferences, setPreferences] = useState([1,1,1,1,1]);
    const [timeStamp, setTimeStamp] = useState('');
    const toast = useToast();
    const successMsg = "Added time preference result to the list of profiles for submission";

    const closeModal = () => {
        setStudentID('');
        setProjectCount(5);
        setOptions([1,2,3,4,5]);
        setPreferences([1,1,1,1,1]);
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
        return errors;
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
            preferences: preferences,
            timeStamp: timeStamp
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

        let numbers = [];
        let pref = new Array(parseInt(event)).fill(1);

        for (let i = 1; i <= parseInt(event); i++) {
            numbers.push(i);
            if (i < preferences.length){
                pref[i-1] = preferences[i-1];
            }
        }
        setPreferences(pref);
        setOptions(numbers);
        return;
    }

    const addPreference = (event, option) => {
        let temp = preferences;
        temp[option - 1] = parseInt(event.target.value);
        setPreferences(temp);
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
                            min={1}
                            value={projectCount}
                            onChange={(event) => { changeProjectCount(event);}}
                        />
                        {options.map((option) => {
                            return (
                                <div >
                                    <FormLabel>{'Project Preference: '} {option}</FormLabel>
                                    <Dropdown 
                                    placeholder={''}
                                    options={options}
                                    onChange={(event) => { addPreference(event, option);}}
                                    />
                                </div>
                            )
                            
                        })}
                        {/* <TextField
                            label="Timestamp"
                            value={timeStamp}
                            onChange={(event) => { setTimeStamp(event.target.value); }}
                        /> */}
                        <FormLabel>Timestamp</FormLabel>
                        <input type="datetime-local" value={timeStamp} onChange={(event) => { setTimeStamp(event.target.value); }}/>
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

