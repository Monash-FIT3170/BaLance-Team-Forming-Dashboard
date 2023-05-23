// Delete profile component
// Props: isModalOpen, student, handleCancelDelete, handleConfirmDelete

import * as React from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from '@chakra-ui/react';

export class DeleteProfile extends React.Component {
  render() {
    return (
      <Modal isOpen={this.props.isModalOpen} onClose={this.props.handleCancelDelete}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Delete Profile</ModalHeader>
          <ModalBody>
            <p>Are you sure you want to delete the following profile?</p> <br />
            <b>Name: </b>{' '}
            <p>
              {this.props.student.studentFirstName} {this.props.student.studentLastName}
            </p>
            <b>Email Address: </b> <p> {this.props.student.studentEmailAddress} </p>
            <b>WAM: </b> <p>{this.props.student.wamAverage}</p>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="red" mr={3} onClick={this.props.handleConfirmDelete}>
              Delete
            </Button>
            <Button onClick={this.props.handleCancelDelete}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    );
  }
}
