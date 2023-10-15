import { Box, Center, Table, Tbody, Td, Th, Thead, Tr, useDisclosure, useToast } from "@chakra-ui/react";
import React from "react";
import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import { useParams } from "react-router";
import { MockAuth } from "../../helpers/mockAuth";
import { useAuth0 } from "@auth0/auth0-react";
import getToastSettings from "./ToastSettings";
import ChangeGroupModal from "../groupsPage/ChangeGroupModal";

const StudentsPreviewTable = ({ students, groupNumber, numberOfGroups, page, rowHeights }) => {
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

    const getStudentData = (student) => {

        return {
            student_id: student.student_id,
            preferred_name: student.preferred_name,
            group_number: student.group_number,
            lab_number: student.lab_number
        }
        
    }

    const {
        unitCode,
        year,
        period,
    } = useParams();

    const deleteStudent = (student) => {
        const {
            student_id,
            preferred_name,
            last_name
        } = student

        let apiEndpoint;
        let toastMsg;

        if (page === 'students') {
            apiEndpoint = `api/students/enrolment/${unitCode}/${year}/${period}/${student_id}`
            toastMsg = `Successfully removed ${preferred_name} ${last_name} from the offering`
        } else if (page === 'groups') {
            apiEndpoint = `api/students/groupAlloc/${unitCode}/${year}/${period}/${student_id}`
            toastMsg = `Successfully removed ${preferred_name} ${last_name} from the group`
        }

        getAccessTokenSilently().then((token) => {
            fetch(`http://localhost:8080/${apiEndpoint}`, {
                method: 'DELETE',
                headers: new Headers({
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }),
            });
        });

        getToast(toastMsg, 'success'); // fixme incorporate into .then chain in fetch
        setTimeout(() => {
            window.location.reload();
        }, 1500)
    }

    return (
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
                        <Th>Student ID</Th><Th>Preferred Name</Th><Th>Last Name</Th><Th>Email Address</Th><Th>WAM</Th>
                    </Tr>
                </Thead>

                <Tbody>
                    {students.map((student) => (
                        <Tr h={rowHeights}>
                            <Td>{student.student_id}</Td>
                            <Td>{student.preferred_name}</Td>
                            <Td>{student.last_name}</Td>
                            <Td>{student.email_address}</Td>
                            <Td>{student.wam_val}</Td>
                            <Td>
                                <ChangeGroupModal
                                    studentData={getStudentData(student)}
                                    numberOfGroups={numberOfGroups}
                                />
                            </Td>
                            <Td>
                                <DeleteIcon
                                    style={{ cursor: 'pointer' }}
                                    onClick={(event) => {
                                        event.preventDefault()
                                        deleteStudent(student)
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