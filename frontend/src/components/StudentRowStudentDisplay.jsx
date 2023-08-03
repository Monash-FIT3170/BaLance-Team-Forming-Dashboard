import { Tr, Td, HStack } from '@chakra-ui/react';
import { DeleteIcon } from '@chakra-ui/icons';
import ChangeStudentGroupModal from './ChangeStudentGroupModal';

const StudentRowStudentDisplay = ({studentData, numberOfGroups, onDelete}) => {
    /* HTML component for each student in each group in the 'List Students' View */
    const {
        student_id,
        preferred_name,
        last_name,
        email_address,
        group_number
    } = studentData;

    const handleDelete = () => {
        onDelete(student_id);
    }

    return (
        <Tr>
            <Td>{student_id}</Td>
            <Td>{preferred_name}</Td>
            <Td>{last_name}</Td>
            <Td>{email_address}</Td>
            <Td>{group_number}</Td>
            <Td>
            <HStack>
                <ChangeStudentGroupModal
                    studentData={studentData}
                    numberOfGroups={numberOfGroups}
                />
            </HStack>
            </Td>
            <Td>
                <DeleteIcon
                style={{ cursor: 'pointer', color: 'red' }}
                />
             </Td>
        </Tr>
    );
};

export default StudentRowStudentDisplay;
