import { Tr, Td, HStack } from '@chakra-ui/react';
import ChangeStudentGroupModal from './ChangeStudentGroupModal';

const StudentRowStudentDisplay = ({studentData, studentLab, studentGroup}) => {
    /* HTML component for each student in each group in the 'List Students' View */
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
            <HStack>
                <ChangeStudentGroupModal
                studentData={studentData}
                studentLab={studentLab}
                studentGroup={studentGroup}
                numberOfGroups={16}
                />
            </HStack>
            </Td>
        </Tr>
    );
};

export default StudentRowStudentDisplay;
