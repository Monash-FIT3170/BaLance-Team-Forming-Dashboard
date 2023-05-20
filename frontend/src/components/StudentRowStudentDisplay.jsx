import {Tr, Td, HStack, Select, Icon} from "@chakra-ui/react";
import ChangeStudentGroupModal from "./ChangeStudentGroupModal";

const StudentRow2=(props)=> {
    /*HTML component for each student in each group in the 'List Students' View*/
    // desctructure the content of props
    const {studentId,studentFirstName, studentEmail,group} = props.props
    const { allLabs} = props;

    let labId = 0;
    console.log(allLabs);
    for (let i = 0; i < allLabs.length; i++) {
        for (let j = 0; j < allLabs[i].members.length; j++){
            if (studentId === allLabs[i].members[j].studentId){
                labId = allLabs[i].labId;
            }
        }
    }

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