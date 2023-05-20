import {Tr, Td, HStack, Select, Icon} from "@chakra-ui/react";
import ChangeStudentGroupModal from "./ChangeStudentGroupModal";

const StudentRow2=(props)=> {
    /*HTML component for each student in each group in the 'List Students' View*/
    // desctructure the content of props
    const {studentFirstName, studentEmail,labId,group} = props.props
    const { allLabs} = props;

    return (
        <Tr>
            <Td>{studentFirstName}</Td>
            <Td>{studentEmail}</Td>
            <Td>{labId}</Td>
            <Td>{group.groupNumber}</Td>
            <Td>
                <HStack>
                    <ChangeStudentGroupModal studentInfo={props} classNum={labId} groupNum={group.groupNumber} groupId = {group.groupId} allIds = {allLabs}/>
                </HStack>
            </Td>
        </Tr>
    )
}

export default StudentRow2