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

import {Dropdown, TextField} from "../../_shared";
import ModalFooterButtonPair from "../../_shared/ModalFooterButtonPair";

const AddBelbinModalBody = ({isOpen, onClose, profilesList, setProfilesList}) => {
    const [studentID, setStudentID] = useState('');
    const [belbinType, setBelbinType] = useState('');
    const toast = useToast();

    const successMsg = "Added belbin result to the list of profiles for submission";
    const validateFields = () => {
        const errors = [];

        if (studentID.length === 0) {
            errors.push('student ID must be provided')
        } else if (studentID.search(/^[0-9]{8}$/) === -1) {
            errors.push('student ID must be an 8 digit number')
        }

        if (belbinType === '') {
            errors.push('belbin type must be provided')
        } else if (belbinType !== 'people' && belbinType !== 'action' && belbinType !== 'thinking') {
            errors.push('please select a belbin type')
        }

        return errors;
    }

    const handleSubmit = () => {
        const errors = validateFields()

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
            studentID: studentID,
            belbinType: belbinType
        }

        setProfilesList([...profilesList, newProfile]);

        toast({
            title: 'Profile added',
            description: successMsg,
            status: 'success',
            duration: 4000,
            isClosable: true,
        })
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay/>
            <ModalContent>
                <ModalCloseButton/>
                <ModalHeader>Add a Belbin personality result</ModalHeader>
                <ModalBody>
                    <FormControl isRequired>
                        <TextField
                            label="Student ID"
                            value={studentID}
                            onChange={(event) => {setStudentID(event.target.value)}}
                        />
                        <FormLabel>Belbin personality type</FormLabel>
                        <Dropdown
                            placeholder={'select personality type'}
                            required={true}
                            options={['action', 'people', 'thinking']}
                            width='100%'
                            onChange={(event) => { setBelbinType(event.target.value) }}
                        />
                    </FormControl>
                </ModalBody>
                <ModalFooterButtonPair
                    cancelButtonText={'Cancel'}
                    cancelButtonColor={'red'}
                    cancelButtonOnClick={onClose}
                    confirmButtonText={'Submit'}
                    confirmButtonColor={'blue'}
                    confirmButtonOnClick={handleSubmit}
                />
            </ModalContent>
        </Modal>
    );
};

export default AddBelbinModalBody;
