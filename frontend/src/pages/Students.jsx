import React, { useState, useEffect } from 'react';
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
import StudentRowStudentDisplay from '../components/StudentRowStudentDisplay';
import { Link, useNavigate } from 'react-router-dom';
import { ShuffleGroups } from '../components/ShuffleGroups';
import { AddIcon, EditIcon } from '@chakra-ui/icons';

function Students() {
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

    const navigateToStudentUpload = () => {
        navigate(`/uploadStudents/${unitCode}/${year}/${period}`);
    };

    const navigateToWorkEthicUpload = () => {
        navigate(`/infoImport/${unitCode}/${year}/${period}`);
    };

    const navigateToBelbinUpload = () => {
        navigate(`/belbinImport/${unitCode}/${year}/${period}`);
    }

    const navigateToCreateGroups = () => {
        navigate(`/createGroups/${unitCode}/${year}/${period}`);
    }

    const navigateToUnitAnalytics = () => {
        navigate(`/unitAnalytics/${unitCode}/${year}/${period}`);
    }

    useEffect(() => {
        // fetch students from the backend
        fetch(`http://localhost:8080/api/students/${unitCode}/${year}/${period}`)
            .then((res) => res.json())
            .then((res) => {
                setStudents(res);
            })
            .catch((err) => console.error(err));

        // fetch groups from the backend
        fetch(`http://localhost:8080/api/groups/${unitCode}/${year}/${period}`)
            .then((res) => res.json())
            .then((res) => {
                setNumberOfGroups(res.length);
            })
            .catch((err) => console.error(err));

    }, []);

    const handleShuffleGroups = () => {
        // Close confirmation dialog
        onClose();

        // API call to create groups from scratch - will automatically delete existing groups first
        fetch(`http://localhost:8080/api/groups/shuffle/${unitCode}/${year}/${period}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                groupSize: groupSize,
                variance: variance,
                strategy: groupStrategy,
            })
        })
            .catch((error) => { console.error('Error:', error); })
            .finally(() => { window.location.reload(); });
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
                        onClick={navigateToStudentUpload}
                        colorScheme="gray"
                        margin-left="20">
                        <HStack>
                            <AddIcon />
                            <Spacer />
                            <Text>Add Students</Text>
                        </HStack>
                    </Button>
                    <Button
                        width="100%"
                        onClick={navigateToBelbinUpload}
                        colorScheme="gray"
                        margin-left="20"
                        isDisabled={students.length === 0}>
                        <HStack>
                            <AddIcon />
                            <Spacer />
                            <Text>Add Personality Data</Text>
                        </HStack>
                    </Button>
                    <Button
                        width="100%"
                        onClick={navigateToWorkEthicUpload}
                        colorScheme="gray"
                        margin-left="20"
                        isDisabled={students.length === 0}>
                        <HStack>
                            <AddIcon />
                            <Spacer />
                            <Text>Add Work Ethic Data</Text>
                        </HStack>
                    </Button>
                </VStack>


                <Spacer />

                <HStack m="40px">
                    <Spacer />
                    <ButtonGroup colorScheme="#282c34" variant="outline" size="lg" isAttached>
                        <Link to={`/groups/${unitCode}/${year}/${period}`}>
                            <Button isDisabled={numberOfGroups === 0}>  Groups  </Button>
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
                        <Center><Text fontWeight={"semibold"}>Show Students from Class:</Text></Center>
                        <Select
                            placeholder={"All"}
                            value={`unitSemesterOffering`}
                            onChange={(event) => `setUnitSemesterOffering(event.target.value)`}
                        >
                            {`<option value="S1">S1</option>
                      <option value="S2">S2</option>
                      <option value="FY">FY</option>`}
                        </Select>
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
