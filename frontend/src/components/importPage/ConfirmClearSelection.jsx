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

const ConfirmClearSelection = (
    isConfirmationClearOpen,
    handleCloseConfirmation,
    handleConfirmClearSelection,
) => {
    return (
        <Modal
        isOpen={isConfirmationClearOpen}
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