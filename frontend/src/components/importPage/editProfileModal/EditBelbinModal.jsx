import {useLayoutEffect, useState} from 'react';
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
    const [studentID, setStudentID] = useState('');
    const [belbinType, setBelbinType] = useState('');
    const toast = useToast();
    const successMsg = "Updated belbin result";

    // these 2 effects are needed to ensure the clicked rows data is rendered
    useLayoutEffect(() => {
        if (currProfile) {
            setStudentID(currProfile.studentId)
            setBelbinType(currProfile.belbinType)
        }
    }, [])

    useLayoutEffect(() => {
        if (currProfile) {
            setStudentID(currProfile.studentId)
            setBelbinType(currProfile.belbinType)
        }
    }, [currProfile])

    const closeModal = () => {
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

        const newProfilesList = profilesList.filter(profile => profile !== currProfile)

        const newProfile = {
            studentID: studentID,
            belbinType: belbinType
        }

        setProfilesList([...newProfilesList, newProfile]);

        toast({
            title: 'Profile updated',
            description: successMsg,
            status: 'success',
            duration: 4000,
            isClosable: true,
        })

        closeModal()
    }

    return (
        <Modal isOpen={isOpen} onClose={closeModal}>
            <ModalOverlay/>
            <ModalContent>
                <ModalCloseButton/>
                <ModalHeader>Edit Belbin personality result</ModalHeader>
                <ModalBody>
                    <FormControl isRequired>
                        <TextField
                            label="Student ID"
                            value={studentID}
                            onChange={(event) => {setStudentID(event.target.value)}}
                        />
                        <FormLabel>Belbin personality type</FormLabel>
                        <Dropdown
                            defaultValue={belbinType}
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