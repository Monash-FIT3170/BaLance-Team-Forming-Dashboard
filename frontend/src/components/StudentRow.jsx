import { Tr, Td, HStack, Spacer } from "@chakra-ui/react";
import { DragHandleIcon, CloseIcon } from '@chakra-ui/icons'

export default function StudentRow(props) {

    // desctructure the content of props 
    const { studentFirstName, studentEmail, wam, status, discPersonality } = props.props;

    return (
        <Tr>
            <Td>
                <HStack>
                    <button><CloseIcon /></button>
                    <Spacer />
                    <button><DragHandleIcon /></button>
                </HStack>
            </Td>
            <Td>{studentFirstName}</Td>
            <Td>{studentEmail}</Td>
            <Td>{wam}</Td>
            <Td>{status}</Td>
            <Td>{discPersonality}</Td>
        </Tr>
    )
}
