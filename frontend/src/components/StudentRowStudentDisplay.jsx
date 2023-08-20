import { Tr, Td, useDisclosure} from '@chakra-ui/react';
import { DeleteIcon } from '@chakra-ui/icons';
import { useParams } from 'react-router';
import ChangeStudentGroupModal from './ChangeStudentGroupModal';

const StudentRowStudentDisplay = ({ studentData, numberOfGroups, onDelete }) => {
    /* HTML component for each student in each group in the 'List Students' View */
    const {
        onClose: onCloseDetails,
    } = useDisclosure();

    const {
        student_id,
        preferred_name,
        last_name,
        email_address,
    } = studentData;

    const {
        unitCode,
        year,
        period
    } = useParams();

  const handleDeleteStudentEnrolment = (event) => {
    event.preventDefault();
    console.log("delete student");
    fetch(`http://localhost:8080/api/students/${unitCode}/${year}/${period}/${student_id}`, {
      method: 'DELETE',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });

    let answer = window.confirm('Student deleted successfully from enrolment');
    if (answer) {
        onCloseDetails();
    }
    window.location.reload();
  }

    return (
        <Tr>
            <Td>{student_id}</Td>
            <Td>{preferred_name}</Td>
            <Td>{last_name}</Td>
            <Td>{email_address}</Td>
            <Td>
                <DeleteIcon
                    style={{ cursor: 'pointer' }}
                    onClick={handleDeleteStudentEnrolment}
                />
            </Td>
        </Tr>
    );
};

export default StudentRowStudentDisplay;
