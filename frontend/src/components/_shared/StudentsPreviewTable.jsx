import { DeleteIcon } from '@chakra-ui/icons';
import { useParams } from 'react-router';
import { useAuth0 } from '@auth0/auth0-react';
import { useState } from 'react';
import {
    Box,
    Center,
    Table,
    Tbody,
    Td,
    Th,
    Thead,
    Tr,
    useDisclosure,
    useToast,
} from '@chakra-ui/react';

import { MockAuth } from '../../helpers/mockAuth';
import ChangeGroupModal from '../groupsPage/ChangeGroupModal';
import DeleteModal from '../homePage/DeleteModal';

const StudentsPreviewTable = ({
    students,
    groupNumber,
    numberOfGroups,
    page,
    rowHeights,
}) => {
    let authService = {
        DEV: MockAuth,
        TEST: useAuth0,
    };

    const { isOpen, onOpen, onClose } = useDisclosure();
    const [deleteEndpoint, setDeleteEndpoint] = useState();
    const [deleteModalHeader, setDeleteModalHeader] = useState();
    const [deleteModalText, setDeleteModalText] = useState();

    const getStudentData = (student) => {
        return {
            student_id: student.student_id,
            preferred_name: student.preferred_name,
            group_number: student.group_number,
            lab_number: student.lab_number,
        };
    };

    const { unitCode, year, period } = useParams();

    const handleDeletionClick = (student) => {
        if (page === 'students') {
            setDeleteEndpoint(
                `/api/students/enrolment/${unitCode}/${year}/${period}/${student.student_id}`
            );
            setDeleteModalHeader(`Delete student from unit?`);
            setDeleteModalText(
                `Are you sure you want to remove ${student.preferred_name} from ${unitCode}`
            );
        } else {
            setDeleteEndpoint(
                `/api/students/groupAlloc/${unitCode}/${year}/${period}/${student.student_id}`
            );
            setDeleteModalHeader(`Delete student from group?`);
            setDeleteModalText(
                `Are you sure you want to remove ${student.preferred_name} from this group?`
            );
        }

        onOpen();
    };

    const renderTable = () => {
        return (
            <Table variant="striped" width="60vw" size="sm" marginBottom="3vh">
                <Thead>
                    <Tr>
                        <Th>Student ID</Th>
                        <Th>Preferred Name</Th>
                        <Th>Last Name</Th>
                        <Th>Email Address</Th>
                        <Th>WAM</Th>
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
                                        event.preventDefault();
                                        handleDeletionClick(student);
                                    }}
                                />
                            </Td>
                        </Tr>
                    ))}
                </Tbody>
            </Table>
        );
    };

    return students.length === 0 ? (
        <Box bg="#E6EBF0" w="60vw" p={4} alignContent="center">
            <Center>
                No students have yet been added to the offering. Click "Add Students" to
                add students to the offering.
            </Center>
        </Box>
    ) : (
        <div>
            {renderTable()}
            <DeleteModal
                modalHeader={deleteModalHeader}
                modalText={deleteModalText}
                apiEndpoint={deleteEndpoint}
                isOpen={isOpen}
                onClose={onClose}
            />
        </div>
    );
};

export default StudentsPreviewTable;
