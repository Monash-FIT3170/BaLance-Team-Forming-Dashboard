import {useState} from "react";
import {
    FormControl,
    Modal,
    ModalBody,
    ModalContent,
    ModalCloseButton,
    ModalHeader,
    ModalOverlay,
    useToast
} from "@chakra-ui/react";

import {TextField} from "../../_shared";
import ModalFooterButtonPair from "../../_shared/ModalFooterButtonPair";

const AddEffortModalBody = ({isOpen, onClose, profilesList, setProfilesList}) => {
    const [studentID, setStudentID] = useState('');
    const [hourCommitment, setHourCommitment] = useState('');
    const [avgAssignmentMark, setAvgAssignmentMark] = useState('');
    const toast = useToast();

    const successMsg = "Added effort result to the list of profiles for submission";
    const validateFields = () => { // todo ensure student id does not exist
        const errors = [];

        if (studentID === '') {
            errors.push('student ID must be provided')
        } else if (studentID.search(/^[0-9]{8}$/) === -1) {
            errors.push('student ID must be an 8 digit number')
        }

        if (hourCommitment === '') {
            errors.push('weekly hour commitment must be provided')
        } else if (hourCommitment.search(/^[0-9]{1,3}$/) === -1 || hourCommitment.toString() > 168) {
            errors.push('weekly hour commitment must be a number between 0 and 168')
        }

        if (avgAssignmentMark === '') {
            errors.push('average assignment marks must be provided')
        } else if (avgAssignmentMark.search(/^[0-9]{1,3}$/) === -1 || avgAssignmentMark.toString() > 100) {
            errors.push('average assignment marks must be a number between 0 and 100')
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
            hourCommitment: hourCommitment,
            avgAssignmentMark: avgAssignmentMark
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
                <ModalHeader>Add an Effort personality result</ModalHeader>
                <ModalBody>
                    <FormControl isRequired>
                        <TextField
                            label="Student ID"
                            value={studentID}
                            onChange={(event) => { setStudentID(event.target.value) }}
                        />
                        <TextField
                            label="Weekly hour commitment"
                            value={hourCommitment}
                            onChange={(event) => { setHourCommitment(event.target.value) }}
                        />
                        <TextField
                            label="Average assignment mark"
                            value={avgAssignmentMark}
                            onChange={(event) => { setAvgAssignmentMark(event.target.value) }}
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

export default AddEffortModalBody;
