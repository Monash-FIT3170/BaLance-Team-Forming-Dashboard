import { useAuth0 } from '@auth0/auth0-react';
import { useParams } from 'react-router-dom';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Button,
} from '@chakra-ui/react';

import { MockAuth } from '../../helpers/mockAuth';

export default function ConfirmChangeGroupModal({
  handleStudentGroupChange,
  oldGroupNumber,
  newGroupNumber,
  oldLabNumber,
}) {
  console.log(oldLabNumber);
  const { isOpen, onOpen, onClose } = useDisclosure();
  let authService = {
    DEV: MockAuth,
    TEST: useAuth0,
  };
  const { getAccessTokenSilently } = authService[import.meta.env.VITE_REACT_APP_AUTH]();
  const { unitCode, year, period } = useParams();

  // checks whether the old group and the new group are in the same lab
  let newLabNumber = -1;
  // fetch old lab number
  // getAccessTokenSilently().then((token) => {
  //     fetch(`http://localhost:8080/api/groups/${unitCode}/${year}/${period}/labNumber/${oldGroupNumber}`,
  //         {
  //             method: 'get',
  //             headers: new Headers({
  //                 'Authorization': `Bearer ${token}`
  //             })
  //         })
  //         .then((res) =>
  //             res.json().then(function (res) {
  //                 oldLabNumber = res[0].lab_number;
  //             })
  //         )
  //         .catch((err) => console.error(err));
  // });
  // fetch new lab number
  getAccessTokenSilently().then((token) => {
    fetch(
      `http://localhost:8080/api/groups/${unitCode}/${year}/${period}/labNumber/${newGroupNumber}`,
      {
        method: 'get',
        headers: new Headers({
          Authorization: `Bearer ${token}`,
        }),
      }
    )
      .then((res) =>
        res.json().then(function (res) {
          newLabNumber = res[0].lab_number;
        })
      )
      .catch((err) => console.error(err));
  });

  return (
    <>
      <Button
        onClick={() => {
          console.log(oldLabNumber, newLabNumber);
          if (oldLabNumber === newLabNumber) {
            handleStudentGroupChange();
          } else {
            onOpen();
          }
        }}
        margin="0px 5px"
        colorScheme="blue"
        mr={3}
      >
        Confirm
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Non Matching Lab Allocations</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            The group you wish to move the student to is in a different lab to their
            current allocation. Are you sure you wish to proceed?
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Button>
            <Button variant="ghost" onClick={handleStudentGroupChange}>
              Confirm
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
