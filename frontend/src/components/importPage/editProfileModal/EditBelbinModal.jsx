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

const EditBelbinModalBody = ({isOpen, onClose, currProfile, profilesList, setProfilesList}) => {
    const [studentID, setStudentID] = useState(currProfile.studentID);
    const [belbinType, setBelbinType] = useState(currProfile.belbinType);
    const toast = useToast();
    const successMsg = "Updated belbin result";

    const closeModal = () => {
        // todo consider this
        setStudentID('')
        setBelbinType('')
        onClose()
    }

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

        // todo find the old profile and delete it
        const newProfilesList = profilesList.filter(profile => profile !== currProfile)

        const newProfile = {
            studentID: studentID,
            belbinType: belbinType
        }

        setProfilesList([...profilesList, newProfile]);

        toast({
            title: 'Profile updated',
            description: successMsg,
            status: 'success',
            duration: 4000,
            isClosable: true,
        })
    }

    return (
        <Modal isOpen={isOpen} onClose={closeModal}>
            <ModalOverlay/>
            <ModalContent>
                <ModalCloseButton/>
                <ModalHeader>Edite Belbin personality result</ModalHeader>
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
                    cancelButtonOnClick={closeModal}
                    confirmButtonText={'Submit'}
                    confirmButtonColor={'blue'}
                    confirmButtonOnClick={handleSubmit}
                />
            </ModalContent>
        </Modal>
    );
};

export default EditBelbinModalBody;