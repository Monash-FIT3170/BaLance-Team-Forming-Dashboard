import React, { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useParams } from 'react-router';
import {
    Table,
    Thead,
    Select,
    Tr,
    Th,
    Tbody,
    Button,
    ButtonGroup,
    HStack,
    Spacer,
    Heading,
    Center,
    useDisclosure,
    Text,
    VStack,
    Box,
    Container,
} from '@chakra-ui/react';
import StudentRowStudentDisplay from '../components/studentsPage/StudentRowStudentDisplay';
import { Link, useNavigate } from 'react-router-dom';
import { ShuffleGroups } from '../components/ShuffleGroups';
import { AddIcon, EditIcon } from '@chakra-ui/icons';
import { MockAuth } from '../mockAuth/mockAuth';

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

            <Button
                me="12px"
                align="right"
                justify="right"
                borderRadius="12px"
                style={{ position: 'absolute', top: 125, right: 10 }}
                onClick={navigateToUnitAnalytics}
                colorScheme="green">
                <HStack><p>View Unit Analytics</p></HStack>
            </Button>

            <HStack margin="0px 20vw 5vh 20vw" alignContent={'center'}>
                <VStack>
                    <Button
                        width="18vw"
                        onClick={navigateToUploadStudentData}
                        colorScheme="gray"
                        margin-left="20">
                        <HStack>
                            <AddIcon />
                            <Spacer />
                            <Text>Import Student Data</Text>
                        </HStack>
                    </Button>
                </VStack>


                <Spacer />

                <HStack m="40px">
                    <Spacer />
                    <ButtonGroup colorScheme="#282c34" variant="outline" size="lg" isAttached>
                        <Link to={`/groups/${unitCode}/${year}/${period}`}>
                            <Button isDisabled={students.length === 0}>  Groups  </Button>
                        </Link>
                        <Button isDisabled={true}>
                            Students
                        </Button>
                    </ButtonGroup>
                    <Spacer />
                </HStack>

                <Spacer />

                <HStack margin="0px 20vw 5vh 20vw" alignContent={'center'}>
                    <VStack>
                        <Button
                            width="18vw"
                            onClick={navigateToCreateGroups}
                            colorScheme="gray"
                            margin-left="20"
                            isDisabled={students.length === 0}>
                            <HStack>
                                <EditIcon />
                                <Spacer />
                                <Text>Create/Reconfigure Groups</Text>
                            </HStack>
                        </Button>
                    </VStack>
                </HStack>
            </HStack>
            
            <Center>
                {studentsDisplay}
            </Center>
        </div>
    );
}

export default Students;