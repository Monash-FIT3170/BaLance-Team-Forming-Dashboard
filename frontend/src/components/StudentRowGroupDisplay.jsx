import { Tr, Td, HStack, Spacer, Button } from '@chakra-ui/react';
import { DeleteIcon } from '@chakra-ui/icons';
import { useParams } from 'react-router';
import ChangeStudentGroupModal from './ChangeStudentGroupModal';
import { useAuth0 } from '@auth0/auth0-react';
import { MockAuth } from '../mockAuth/mockAuth';
//import {unit_code, unit_off_year, unit_off_period} from './GroupCard.jsx';

function StudentRowGroupDisplay({studentData, numberOfGroups}) {
  /* HTML component for each student in each group in the 'View Groups' View */
    const {
        student_id,
        preferred_name,
        last_name,
        email_address,
        wam_val,
    } = studentData;

    const {
        unitCode,
        year,
        period
    } = useParams();


    let authService = {
      "DEV": MockAuth,
      "TEST": useAuth0
    }
  
    const { getAccessTokenSilently } = authService[process.env.REACT_APP_AUTH]();


  const handleDeleteStudent = (event) => {
    getAccessTokenSilently().then((token) => {
    fetch(`http://localhost:8080/api/units/${unitCode}/${year}/${period}/${student_id}`, {
      method: 'DELETE',
      headers: new Headers({
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }),
    });
  });
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
                 style={{ cursor: 'pointer'}}
                 onClick={handleDeleteStudent}
                 />
            </Td>
        </Tr>
    );
}

export default StudentRowGroupDisplay;