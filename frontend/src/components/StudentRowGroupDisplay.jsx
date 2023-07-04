import { Tr, Td, HStack, Spacer } from '@chakra-ui/react';
import ChangeStudentGroupModal from './ChangeStudentGroupModal';

function StudentRowGroupDisplay({studentData, numberOfGroups}) {
  /* HTML component for each student in each group in the 'View Groups' View */
    const {
        student_id,
        preferred_name,
        last_name,
        email_address,
        wam_val
    } = studentData;

    return (
        <Tr>
            <Td>
            <HStack>
                <ChangeStudentGroupModal
                    studentData={studentData}
                    numberOfGroups={numberOfGroups}
                />
            </HStack>
            </Td>
            <Td>{student_id}</Td>
            <Td>{preferred_name}</Td>
            <Td>{last_name}</Td>
            <Td>{email_address}</Td>
            <Td>{wam_val}</Td>
        </Tr>
    );
}

export default StudentRowGroupDisplay;
