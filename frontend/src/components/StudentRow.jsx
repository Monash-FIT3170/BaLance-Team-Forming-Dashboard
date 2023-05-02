import { Tr, Td } from "@chakra-ui/react";
import { DragHandleIcon } from '@chakra-ui/icons'

export default function StudentRow(props) {

    // desctructure the content of props 
    const { studentFirstName, studentEmail, wam, status, classNum, discPersonality } = props.props;

    return (
        <Tr>
            <Td><button><DragHandleIcon /></button></Td>
            <Td>{studentFirstName}</Td>
            <Td>{studentEmail}</Td>
            <Td>{wam}</Td>
            <Td>{status}</Td>
            <Td>{discPersonality}</Td>
        </Tr>
    )
}