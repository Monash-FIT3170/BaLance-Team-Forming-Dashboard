import { EditIcon } from '@chakra-ui/icons';
import { useState } from 'react';
import { useParams } from 'react-router';
import { useAuth0 } from '@auth0/auth0-react';

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
import { MockAuth } from '../../helpers/mockAuth';

export default function ChangeGroupModal({ studentData, numberOfGroups }) {
    const {
        unitCode,
        year,
        period
    } = useParams();

    const {
        isOpen,
        onOpen,
        onClose
    } = useDisclosure();

    const {
        student_id,
        preferred_name,
    } = studentData;

    const [group, setGroup] = useState(1);

    let authService = {
        "DEV": MockAuth,
        "TEST": useAuth0
    }

    const { getAccessTokenSilently } = authService[process.env.REACT_APP_AUTH]();

    // an array of viable groups the student can be changed to
    const groupOptions = [];
    for (let i = 1; i <= numberOfGroups; i++) {
        groupOptions.push({
            label: `Group ${i}`,
            value: i
        })

    }

    // handles modal confirmation for changing a students group

    const handleStudentGroupChange = async () => {
        onClose();
        console.log(group)
        let token = await getAccessTokenSilently()
        await fetch(
            `http://localhost:8080/api/groups/${unitCode}/${year}/${period}/move/${student_id}/`, {
            method: 'PATCH',
            body: JSON.stringify({ newGroup: group }),
            headers: new Headers({
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json',
                'Content-type': 'application/json; charset=UTF-8'
            }),
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
                            {`Change ${preferred_name}'s group to: `}
                        </Text>
                        <Select
                            bg="white"
                            onChange={(event) => setGroup(event.target.value)}
                        >
                            {groupOptions?.map((option) => (
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
                                onClick={handleStudentGroupChange}
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
