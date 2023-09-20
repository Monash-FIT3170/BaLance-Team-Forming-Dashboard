import { Tr, Td, useDisclosure, useToast } from '@chakra-ui/react';
import { DeleteIcon } from '@chakra-ui/icons';
import { useParams } from 'react-router';
import getToastSettings from '../ToastSettings';
import { MockAuth } from '../../mockAuth/mockAuth';
import { useAuth0 } from '@auth0/auth0-react';

const StudentRowStudentDisplay = ({ studentData, numberOfGroups, onDelete }) => {
    let authService = {
        "DEV": MockAuth,
        "TEST": useAuth0
    }

    const { getAccessTokenSilently } = authService[process.env.REACT_APP_AUTH]();
    /* HTML component for each student in each group in the 'List Students' View */
    const {
        onClose: onCloseDetails,
    } = useDisclosure();

    const toast = useToast();
    const getToast = (title, status) => {
        toast.closeAll();
        toast(getToastSettings(title, status))
    }

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
        getAccessTokenSilently().then((token) => {
            fetch(`http://localhost:8080/api/students/enrolment/${unitCode}/${year}/${period}/${student_id}`, {
                method: 'DELETE',
                headers: new Headers({
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }),
            });
        });

        getToast(`You have successfully deleted student ${student_id} from the offering`, 'success');

        setTimeout(() => {
            onCloseDetails();
            window.location.reload();
        }, 1500)

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
