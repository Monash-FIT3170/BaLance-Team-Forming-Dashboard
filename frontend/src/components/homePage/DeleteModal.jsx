import { useAuth0 } from '@auth0/auth0-react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useToast,
} from '@chakra-ui/react';

import { MockAuth } from '../../helpers/mockAuth';
import ModalFooterButtonPair from '../_shared/ModalFooterButtonPair';

const DeleteModal = ({ modalHeader, modalText, apiEndpoint, isOpen, onClose }) => {
  let authService = { DEV: MockAuth, TEST: useAuth0 };
  const { getAccessTokenSilently } = authService[import.meta.env.VITE_REACT_APP_AUTH]();
  const toast = useToast();

  const handleDeletion = () => {
    getAccessTokenSilently().then((token) => {
      fetch(apiEndpoint, {
        method: 'DELETE',
        headers: new Headers({ Authorization: `Bearer ${token}` }),
      })
        .then((res) => {
          if (res.ok) {
            toast({
              title: 'Deletion successful',
              description: 'Item has successfully been deleted',
              status: 'success',
              duration: 4000,
              isClosable: true,
            });

            setTimeout(() => {
              onClose();
              window.location.reload();
            }, 1500);
          } else {
            // todo handle non ok responses
            onClose();
            toast({
              title: 'Error',
              description: 'Failed to delete',
              status: 'error',
              duration: 4000,
              isClosable: true,
            });
          }
        })
        .catch((e) => {
          console.log(e);
          toast({
            title: 'Network error',
            description: 'Could not connect to the server',
            status: 'error',
            duration: 4000,
            isClosable: true,
          });
        });
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{modalHeader}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>{modalText}</ModalBody>

        <ModalFooterButtonPair
          cancelButtonText="cancel"
          cancelButtonColor="red"
          cancelButtonOnClick={onClose}
          confirmButtonText="delete"
          confirmButtonColor="blue"
          confirmButtonOnClick={handleDeletion}
        />
      </ModalContent>
    </Modal>
  );
};

export default DeleteModal;
