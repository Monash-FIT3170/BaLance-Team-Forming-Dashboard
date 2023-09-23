// A modal that appears when user clicks 'clear selection' after uploading CSV
// Props: isConfirmationClearOpen, handleCloseConfirmation, handleConfirmClearSelection

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

export class ConfirmClearSelection extends React.Component {
  render() {
    return (
      <Modal
        isOpen={this.props.isConfirmationClearOpen}
        onClose={this.props.handleCloseConfirmation}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Confirm Clear Selection</ModalHeader>
          <ModalCloseButton />
          <ModalBody>Are you sure you want to clear the selection?</ModalBody>
          <ModalFooter>
            <Button colorScheme="red" onClick={this.props.handleConfirmClearSelection}>
              Clear Selection
            </Button>
            <Button variant="ghost" onClick={this.props.handleCloseConfirmation}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    );
  }
}
