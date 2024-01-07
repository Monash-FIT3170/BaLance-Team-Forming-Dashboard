import { useState } from 'react';
import {
    Modal, ModalCloseButton,
    ModalContent,
    ModalOverlay,
    useToast
} from "@chakra-ui/react";

import AddStudentModalBody from "./AddStudentModalBody";
import AddBelbinModalBody from "./AddBelbinModalBody";
import AddEffortModalBody from "./AddEffortModalBody";
import ModalFooterButtonPair from "../../_shared/ModalFooterButtonPair";

const AddProfileModal = ({dataType, profiles, setProfiles, isOpen, onClose}) => {
    const [validateFields, setValidateFields] = useState(() => {})
    const [successMsg, setSuccessMsg] = useState('Profile has been successfully added to list')
    const [newProfile, setNewProfile] = useState()
    const toast = useToast()

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

        toast({
            title: 'Profile added',
            description: successMsg,
            status: 'success',
            duration: 4000,
            isClosable: true,
        })

        setProfiles([...profiles, newProfile]);
    }

    const renderModalBody = () => {
        /**
         * Returns a different form based on what data type the user has selected
         * to upload
         *
         */

        switch (dataType) {
            case "students":
                return <AddStudentModalBody
                    setValidateFields={setValidateFields}
                    setSuccessMsg={setSuccessMsg}
                    setNewProfile={setNewProfile}
                />

            case "effort":
                return <AddEffortModalBody
                    setValidateFields={setValidateFields}
                    setSuccessMsg={setSuccessMsg}
                    setNewProfile={setNewProfile}
                />

            case "belbin":
                return <AddBelbinModalBody
                    setValidateFields={setValidateFields}
                    setSuccessMsg={setSuccessMsg}
                    setNewProfile={setNewProfile}
                />
        }
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay/>
            <ModalContent>
                <ModalCloseButton/>
                {renderModalBody()}
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
    )
}

export default AddProfileModal;