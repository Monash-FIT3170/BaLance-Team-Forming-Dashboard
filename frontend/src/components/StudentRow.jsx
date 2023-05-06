import { Tr, Td, HStack, Spacer } from "@chakra-ui/react";
import { DragHandleIcon, CloseIcon } from '@chakra-ui/icons'

function StudentRow(props) {
    /*HTML component for each student in each group in the 'View Groups' View*/
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

export default StudentRow
