import {
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay
} from "@chakra-ui/react";


const EditStudentModal = ({isOpen, onClose, currProfile, profilesList, setProfilesList}) => {

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Edit Profile</ModalHeader>
                <ModalBody>
                    {/*    */}
                </ModalBody>
                <ModalFooter>
                    {/*    */}
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}

export default EditStudentModal;