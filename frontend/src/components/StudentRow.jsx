import { Tr, Td, HStack, Spacer } from "@chakra-ui/react";
import { DragHandleIcon, CloseIcon } from '@chakra-ui/icons'

export default function StudentRow(props) {

    // desctructure the content of props 
    const { firstName, email, classNum, wamAverage, enrolmentStatus, discPersonality } = props;

    return (
        <Tr>
            <Td>
                <HStack>
                    <button><CloseIcon /></button>
                    <Spacer />
                    <button><DragHandleIcon /></button>
                </HStack>
            </Td>
            <Td>{firstName}</Td>
            <Td>{email}</Td>
            <Td>{classNum}</Td>
            <Td>{wamAverage}</Td>
            <Td>{enrolmentStatus}</Td>
            <Td>{discPersonality}</Td>
        </Tr>
    )
}