import { Tr, Td, HStack, Select, Icon } from '@chakra-ui/react';
import ChangeStudentGroupModal from './ChangeStudentGroupModal';

const StudentRow2 = ({studentData, studentLab, studentGroup}) => {
    /*HTML component for each student in each group in the 'List Students' View*/
    const {
        student_id,
        preferred_name,
        last_name,
        email_address
    } = studentData;

    return (
    <Tr>
        <Td>{student_id}</Td>
        <Td>{preferred_name}</Td>
        <Td>{last_name}</Td>
        <Td>{email_address}</Td>
        <Td>{studentGroup}</Td>
        <Td>
        {/*<HStack>*/}
        {/*    <ChangeStudentGroupModal*/}
        {/*    studentInfo={studentData}*/}
        {/*    classNum={studentLab}*/}
        {/*    groupNum={studentGroup}*/}
        {/*    />*/}
        {/*</HStack>*/}
        </Td>
    </Tr>
    );
};

export default StudentRow2;
