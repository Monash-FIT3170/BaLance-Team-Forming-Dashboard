import { Tr, Td, HStack, Spacer, Button } from '@chakra-ui/react';
import { DeleteIcon } from '@chakra-ui/icons';
import ChangeStudentGroupModal from './ChangeStudentGroupModal';

function StudentRowGroupDisplay({studentData, numberOfGroups, onDelete}) {
  /* HTML component for each student in each group in the 'View Groups' View */
    const {
        student_id,
        preferred_name,
        last_name,
        email_address,
        wam_val
    } = studentData;

    const handleDelete = () => {
        onDelete(student_id);
    }
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
            <Td>
                <DeleteIcon
                 style={{ cursor: 'pointer', color: 'red' }}
                 onClick={handleDelete}
                 />
            </Td>
        </Tr>
    );
}

export default StudentRowGroupDisplay;
