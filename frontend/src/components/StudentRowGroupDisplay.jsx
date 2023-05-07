import { Tr, Td, HStack, Spacer } from "@chakra-ui/react";
import { DragHandleIcon, CloseIcon } from '@chakra-ui/icons'
import ChangeStudentGroupModal from "./ChangeStudentGroupModal"


function StudentRow(props) {
    /*HTML component for each student in each group in the 'View Groups' View*/
    // desctructure the content of props 
    const { studentFirstName, studentEmail, wam, status, discPersonality } = props.studentInfo;
    const classNum = props.classNum;
    const groupNum = props.groupNum;

    return (
        <Tr>
            <Td>
                <HStack>
                    <button><CloseIcon /></button>
                    <Spacer />
                    <ChangeStudentGroupModal studentFirstName={studentFirstName} classNum={classNum} groupNum={groupNum}/>
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
