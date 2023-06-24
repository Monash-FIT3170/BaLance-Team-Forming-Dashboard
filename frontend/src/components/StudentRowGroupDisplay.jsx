import { Tr, Td, HStack, Spacer } from '@chakra-ui/react';
import { DragHandleIcon, CloseIcon } from '@chakra-ui/icons';
import ChangeStudentGroupModal from './ChangeStudentGroupModal';

function StudentRowGroupDisplay({studentData, numberOfGroups}) {
  /* HTML component for each student in each group in the 'View Groups' View */
    const {
        studentId,
        preferredName,
        lastName,
        emailAddress,
        wamVal
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
            <Td>{studentId}</Td>
            <Td>{preferredName}</Td>
            <Td>{lastName}</Td>
            <Td>{emailAddress}</Td>
            <Td>{wamVal}</Td>
        </Tr>
    );
}

export default StudentRowGroupDisplay;
