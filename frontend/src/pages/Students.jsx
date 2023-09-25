import React, { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useParams } from 'react-router';
import {
    Table,
    Thead,
    Tr,
    Th,
    Tbody,
    Button,
    ButtonGroup,
    HStack,
    Heading,
    Center,
    useDisclosure,
    Box
} from '@chakra-ui/react';
import StudentRowStudentDisplay from '../components/studentsPage/StudentRowStudentDisplay';
import { Link, useNavigate } from 'react-router-dom';
import { AddIcon, EditIcon, ViewIcon } from '@chakra-ui/icons';
import { MockAuth } from '../helpers/mockAuth';
import NavButton from "../components/shared/NavButton";
import ToggleButtonGroup from "../components/shared/ToggleButtonGroup";

function Students() {
    let authService = {
        "DEV": MockAuth,
        "TEST": useAuth0
    }

    const { getAccessTokenSilently } = authService[process.env.REACT_APP_AUTH]();
    const [students, setStudents] = useState([]);
    const [numberOfGroups, setNumberOfGroups] = useState(0);
    const cancelRef = React.useRef();
    const navigate = useNavigate();
    const {
        isOpen,
        onOpen,
        onClose
    } = useDisclosure();

    const {
        groupStrategy,
        groupSize,
        variance,
        unitCode,
        year,
        period
    } = useParams();

    const navigateToUploadStudentData = () => {
        navigate(`/uploadData/${unitCode}/${year}/${period}`);
    };

    const navigateToCreateGroups = () => {
        navigate(`/createGroups/${unitCode}/${year}/${period}`);
    }

    const navigateToUnitAnalytics = () => {
        navigate(`/unitAnalytics/${unitCode}/${year}/${period}`);
    }

    useEffect(() => {
        getAccessTokenSilently().then((token) => {
            // fetch students from the backend
            fetch(`http://localhost:8080/api/students/${unitCode}/${year}/${period}`,
                {
                    method: 'get',
                    headers: new Headers({
                        'Authorization': `Bearer ${token}`
                    })
                })
                .then((res) => res.json())
                .then((res) => {
                    setStudents(res);
                })
                .catch((err) => console.error(err));

            // fetch groups from the backend
            fetch(`http://localhost:8080/api/groups/${unitCode}/${year}/${period}`,
                {
                    method: 'get',
                    headers: new Headers({
                        'Authorization': `Bearer ${token}`
                    })
                })
                .then((res) => res.json())
                .then((res) => {
                    setNumberOfGroups(res.length);
                })
                .catch((err) => console.error(err));

        })
    }, []);

    const handleShuffleGroups = () => {
        // Close confirmation dialog
        onClose();

        getAccessTokenSilently().then((token) => {
            // API call to create groups from scratch - will automatically delete existing groups first
            fetch(`http://localhost:8080/api/groups/shuffle/${unitCode}/${year}/${period}`, {
                method: 'POST',
                headers: new Headers({
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }),
                body: JSON.stringify({
                    groupSize: groupSize,
                    variance: variance,
                    strategy: groupStrategy,
                })
            })
                .catch((error) => { console.error('Error:', error); })
                .finally(() => { window.location.reload(); });
        });
    }

    let studentsDisplay = students.length === 0 ?
        <Box bg='#E6EBF0' w='60vw' p={4} alignContent="center">
            <Center>
                No students have yet been added to the offering. Click "Add Students" to add students to the offering.
            </Center>
        </Box>
        :
        <Table variant="striped" width="60vw" size="sm" marginBottom="3vh">
            <Thead>
                <Tr>
                    <Th>ID</Th>
                    <Th>Preferred Name</Th>
                    <Th>Last Name</Th>
                    <Th>Email Address</Th>
                </Tr>
            </Thead>

            <Tbody>
                {students.map((student) => (
                    <StudentRowStudentDisplay
                        studentData={student}
                        numberOfGroups={numberOfGroups}
                        key={student.student_id}
                    />
                ))}
            </Tbody>
        </Table>
        ;

    return (
        <div>
            <Heading alignContent={'center'}>
                <Center margin="10">{`${unitCode} - ${period}, ${year}`}</Center>
            </Heading>

            <HStack justifyContent={"center"}>
                <NavButton
                    buttonText="Import student data"
                    buttonUrl={`/uploadData/${unitCode}/${year}/${period}`}
                    buttonIcon={<AddIcon />}
                />
                <NavButton
                    buttonText="Create/reconfigure groups"
                    buttonUrl={`/createGroups/${unitCode}/${year}/${period}`}
                    buttonIcon={<EditIcon />}
                />
                <NavButton
                    buttonText="View unit analytics"
                    buttonUrl={`/unitAnalytics/${unitCode}/${year}/${period}`}
                    buttonIcon={<ViewIcon/>}
                />
            </HStack>
            <br/>
            <HStack margin="0px 20vw 5vh 20vw" justifyContent={'center'}>
                <ToggleButtonGroup
                    leftButtonIsDisabled={false}
                    leftButtonUrl={`/groups/${unitCode}/${year}/${period}`}
                    leftButtonText="Groups"
                    rightButtonIsDisabled={true}
                    rightButtonUrl={`/students/${unitCode}/${year}/${period}`}
                    rightButtonText="Students"
                />

            </HStack>
            <Center>
                {studentsDisplay}
            </Center>
        </div>
    );
}

export default Students;