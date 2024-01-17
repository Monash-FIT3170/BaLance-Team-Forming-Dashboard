import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button
} from '@chakra-ui/react';

const DeleteProfileModal = ({
    isOpen,
    profileToDelete,
    setProfileToDelete,
    profiles,
    setProfiles,
    onClose
}) => {

    const handleConfirmDelete = () => {
        if (profileToDelete !== null) {
            const newProfiles = profiles.filter(
                (profile) => profile.studentId !== profileToDelete.studentId
            );
            setProfiles(newProfiles);
            setProfileToDelete(null);
            onClose();
        }
    };

    const handleCancelDelete = () => {
        setProfileToDelete(null);
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={handleCancelDelete}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Delete Profile</ModalHeader>
                <ModalBody>
                    <p>Are you sure you want to delete the following profile?</p>
                    <br/>
                    {profileToDelete !== null ? Object.keys(profileToDelete).map((key) => {
                        return (
                            <>
                                <b>{key}</b>
                                <p>{profileToDelete[key]}</p>
                            </>
                    )}) : null}
                </ModalBody>

                <ModalFooter>
                    <Button colorScheme="red" mr={3} onClick={handleConfirmDelete}>
                        Delete
                    </Button>
                    <Button onClick={handleCancelDelete}>Cancel</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}

export default DeleteProfileModal;