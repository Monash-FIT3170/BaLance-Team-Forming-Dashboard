import { EditIcon } from '@chakra-ui/icons';
import { useState } from 'react';
import { useParams } from 'react-router';

import {
  Button,
  HStack,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  Spacer,
  Text,
  useDisclosure,
} from '@chakra-ui/react';

export default function ChangeStudentGroupModal(props) {
  const { unitID } = useParams();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { studentInfo, classNum, groupNum, allIds, groupId } = props;
  const [changeGroupObj, setChangeGroupObj] = useState({
    initialGroupId: null,
    newGroupId: groupId,
  });

  let options = [];

  for (let i = 0; i < allIds.length; i++) {
    if (classNum === allIds[i].labId && allIds[i].groupNumber !== groupNum) {
      options.push({
        label: `Group ${allIds[i].groupNumber}`,
        value: `${allIds[i].groupId}`,
      });
    }
  }

  const handleConfirmClick = () => {
    onClose();

    fetch(
      'http://localhost:8080/api/groups/' +
        unitID +
        '/move/' +
        studentInfo.studentId +
        '/',
      {
        method: 'PATCH',
        body: JSON.stringify({
          previousGroup: changeGroupObj.initialGroupId,
          newGroup: changeGroupObj.newGroupId,
        }),
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      }
    );

    window.location.reload();
  };

  return (
    <>
      <Button variant="ghost" onClick={onOpen}>
        <EditIcon />
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />

        <ModalContent>
          <ModalHeader>Change Student's Group</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text margin="0px 0px 2vh 0px">
              {'Change ' +
                studentInfo.studentFirstName +
                "'s group from Group " +
                groupNum +
                ' to: '}
            </Text>
            <Select
              bg="white"
              onChange={(event) =>
                setChangeGroupObj({
                  initialGroupId: `${changeGroupObj.newGroupId}`,
                  newGroupId: event.target.value,
                })
              }
              placeholder={`Group ${groupNum}`}
            >
              {options?.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
          </ModalBody>

          <ModalFooter>
            <HStack>
              <Spacer />
              <Button margin="0px 5px" variant="ghost" onClick={onClose}>
                Cancel
              </Button>
              <Button
                onClick={handleConfirmClick}
                margin="0px 5px"
                colorScheme="blue"
                mr={3}
              >
                Confirm
              </Button>
              <Spacer />
            </HStack>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
