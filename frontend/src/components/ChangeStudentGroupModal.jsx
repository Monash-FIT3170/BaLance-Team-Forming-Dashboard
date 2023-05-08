import { DragHandleIcon } from "@chakra-ui/icons"
import { Button, HStack, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Select, Spacer, Text, useDisclosure } from "@chakra-ui/react"

export default function ChangeStudentGroupModal(props) {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const { studentFirstName, classNum, groupNum } = props;
    return (
        <>
            <Button variant="ghost" onClick={onOpen}><DragHandleIcon /></Button>

            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />

                <ModalContent>

                    <ModalHeader>Modal Title</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Text margin="0px 0px 2vh 0px">
                            {"Change " + studentFirstName + "'s group from Lab " + classNum + ", Group " + groupNum + " to: "}
                        </Text>
                        <Select bg="white">
                            <option value='option1'>{"Lab " + classNum + ", Group 1"}</option>
                            <option value='option2'>{"Lab " + classNum + ", Group 2"}</option>
                            <option value='option3'>{"Lab " + classNum + ", Group 3"}</option>
                            <option value='option1'>{"Lab " + classNum + ", Group 4"}</option>
                            <option value='option2'>{"Lab " + classNum + ", Group 5"}</option>
                            <option value='option3'>{"Lab " + classNum + ", Group 6"}</option>
                        </Select>
                    </ModalBody>

                    <ModalFooter>
                        <HStack>
                            <Spacer />
                            <Button margin="0px 5px" variant="ghost" onClick={onClose}>Cancel</Button>
                            <Button margin="0px 5px" colorScheme='blue' mr={3} >Confirm</Button>
                            <Spacer />
                        </HStack>
                    </ModalFooter>

                </ModalContent>
            </Modal>
        </>
    )
}