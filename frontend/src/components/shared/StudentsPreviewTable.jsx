import {Box, Center, Table, Tbody, Td, Th, Thead, Tr, useDisclosure, useToast} from "@chakra-ui/react";
import React from "react";
import {DeleteIcon} from "@chakra-ui/icons";
import {useParams} from "react-router";
import {MockAuth} from "../../helpers/mockAuth";
import {useAuth0} from "@auth0/auth0-react";
import getToastSettings from "./ToastSettings";

const StudentsPreviewTable = ({students, numberOfGroups}) => {
    let authService = {
        "DEV": MockAuth,
        "TEST": useAuth0
    }

    const { getAccessTokenSilently } = authService[process.env.REACT_APP_AUTH]();
    const {
        onClose: onCloseDetails,
    } = useDisclosure();

    const toast = useToast();
    const getToast = (title, status) => {
        toast.closeAll();
        toast(getToastSettings(title, status))
    }

    const {
        unitCode,
        year,
        period
    } = useParams();

    const deleteStudentEnrolment = (student) => {
        const {
            student_id,
            preferred_name,
            last_name
        } = student

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

        getToast(`Successfully removed ${preferred_name} ${last_name} from the offering`, 'success');
        setTimeout(() => {
            window.location.reload();
        }, 1500)
    }

    console.log(students)

    return(
        (students.length === 0) ? (
            <Box bg='#E6EBF0' w='60vw' p={4} alignContent="center">
                <Center>
                    No students have yet been added to the offering. Click "Add Students" to add students to the offering.
                </Center>
            </Box>
        ) : (
            <Table variant="striped" width="60vw" size="sm" marginBottom="3vh">
                <Thead>
                    <Tr>
                        <Th>Student ID</Th><Th>Preferred Name</Th><Th>Last Name</Th><Th>Email Address</Th>
                    </Tr>
                </Thead>

                <Tbody>
                    {students.map((student) => (
                        <Tr>
                            <Td>{student.student_id}</Td>
                            <Td>{student.preferred_name}</Td>
                            <Td>{student.last_name}</Td>
                            <Td>{student.email_address}</Td>
                            <Td>
                                <DeleteIcon
                                    style={{ cursor: 'pointer' }}
                                    onClick={(event) => {
                                        event.preventDefault()
                                        deleteStudentEnrolment(student)
                                    }}
                                />
                            </Td>
                        </Tr>
                    ))}
                </Tbody>
            </Table>
        )
    )
}

export default StudentsPreviewTable;