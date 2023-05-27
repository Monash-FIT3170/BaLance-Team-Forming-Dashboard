// Shuffle groups component to be used on Groups and Students pages
// Props: isOpen, onClose, cancelRef, handleShuffleGroups, onOpen

import * as React from 'react';
import {
  Button,
  Icon,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
} from '@chakra-ui/react';

import { BiShuffle } from 'react-icons/bi';

export class ShuffleGroups extends React.Component {
  render() {
    return (
      <div>
        <Button colorScheme="gray" onClick={this.props.onOpen}>
          Shuffle Groups<Icon margin="0px 0px 0px 10px" as={BiShuffle}></Icon>
        </Button>

        <AlertDialog
          isOpen={this.props.isOpen}
          leastDestructiveRef={this.props.cancelRef}
          onClose={this.props.onClose}
        >
          <AlertDialogOverlay>
            <AlertDialogContent>
              <AlertDialogHeader fontSize="lg" fontWeight="bold">
                Shuffle Groups
              </AlertDialogHeader>

              <AlertDialogBody>
                Are you sure? This will delete all existing groups.
              </AlertDialogBody>

              <AlertDialogFooter>
                <Button ref={this.props.cancelRef} onClick={this.props.onClose}>
                  Cancel
                </Button>
                <Button
                  colorScheme="green"
                  onClick={this.props.handleShuffleGroups}
                  ml={3}
                >
                  Shuffle
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialogOverlay>
        </AlertDialog>
      </div>
    );
  }
}
