import * as React from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  Button,
} from '@chakra-ui/react';

const ConfirmClearSelection = ({
   setCsvFile,
   setIsFileChosen,
   setProfiles,
   setIsClearModalOpen,
   isClearModalOpen
}) => {

    const handleConfirmClearSelection = () => {
        setCsvFile(null); // Reset the file selection
        setProfiles([]); // Clear the table data
        setIsFileChosen(false); // Reset the file chosen state
        setIsClearModalOpen(false); // Close the modal
    };

    const handleCloseConfirmation = () => {
        setIsClearModalOpen(false);
    };

    return (
        <Modal
            isOpen={isClearModalOpen}
            onClose={handleCloseConfirmation}
        >
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Confirm Clear Selection</ModalHeader>
                <ModalCloseButton />
                <ModalBody>Are you sure you want to clear the selection?</ModalBody>
                <ModalFooter>
                    <Button colorScheme="red" onClick={handleConfirmClearSelection}>
                        Clear Selection
                    </Button>
                    <Button variant="ghost" onClick={handleCloseConfirmation}>
                        Cancel
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}

export default ConfirmClearSelection;