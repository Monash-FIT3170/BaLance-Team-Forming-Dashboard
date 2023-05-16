import { DragHandleIcon } from "@chakra-ui/icons"
import { useState } from 'react';
import { Button, HStack, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Select, Spacer, Text, useDisclosure } from "@chakra-ui/react"

export default function ChangeStudentGroupModal(props) {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { studentInfo, classNum, groupNum } = props;
    const [changeGroupObj, setChangeGroupObj] = useState(
        {initialGroup: null,
        newGroup: groupNum}
    );

    const handleConfirmClick = () => {
        console.log({
            student: studentInfo, 
            initialGroup: changeGroupObj.initialGroup,
            newGroup: changeGroupObj.newGroup
        });
    }
    
    // generating the group options
    //for (i=0; i<)

    console.log(props);


    return (
        <>
            <Button variant="ghost" onClick={onOpen}><DragHandleIcon /></Button>

            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />

                <ModalContent>

                    <ModalHeader>Change Student's Group</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Text margin="0px 0px 2vh 0px">
                            {"Change " + studentInfo.studentFirstName + "'s group from Lab " + classNum + ", Group " + groupNum + " to: "}
                        </Text>
                        <Select bg="white" onChange={(event) => setChangeGroupObj({initialGroup: changeGroupObj.newGroup, newGroup: event.target.value})}>
                            <option id='option1' value='option1'>{"Lab " + classNum + ", Group 1"}</option>
                            <option id='option2' value='option2'>{"Lab " + classNum + ", Group 2"}</option>
                            <option id='option3' value='option3'>{"Lab " + classNum + ", Group 3"}</option>
                            <option id='option4' value='option4'>{"Lab " + classNum + ", Group 4"}</option>
                            <option id='option5' value='option5'>{"Lab " + classNum + ", Group 5"}</option>
                            <option id='option6' value='option6'>{"Lab " + classNum + ", Group 6"}</option>
                        </Select>
                    </ModalBody>

                    <ModalFooter>
                        <HStack>
                            <Spacer />
                            <Button margin="0px 5px" variant="ghost" onClick={onClose}>Cancel</Button>
                            <Button onClick={handleConfirmClick} margin="0px 5px" colorScheme='blue' mr={3} >Confirm</Button>
                            <Spacer />
                        </HStack>
                    </ModalFooter>

                </ModalContent>
            </Modal>
        </>
    )
    
}