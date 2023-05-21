import { Tr, Td, HStack, Spacer } from "@chakra-ui/react";
import { DragHandleIcon, CloseIcon } from '@chakra-ui/icons'
import ChangeStudentGroupModal from "./ChangeStudentGroupModal"


function StudentRow(props) {
    /*HTML component for each student in each group in the 'View Groups' View*/
    // desctructure the content of props 
    const { studentInfo, classNum, groupNum, key, allIds, groupId } = props;


    return (
        <Tr>
            <Td>
                <HStack>
                    <ChangeStudentGroupModal studentInfo={studentInfo} classNum={classNum} groupNum={groupNum} groupId = {groupId} allIds = {allIds}/>
                </HStack>
            </Td>
            <Td>{studentInfo.studentFirstName}</Td>
            <Td>{studentInfo.studentEmailAddress}</Td>
            <Td>{studentInfo.wamAverage}</Td>
            <Td>{studentInfo.status}</Td>
            <Td>{studentInfo.discPersonality}</Td>
        </Tr>
    )
}

export default StudentRow
