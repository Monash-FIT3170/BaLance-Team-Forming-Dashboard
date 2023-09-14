import GroupCard from '../components/GroupCard';
import { useParams } from 'react-router';
import { useAuth0 } from '@auth0/auth0-react';
import React, { useState, useEffect } from 'react';
import {
    Button,
    ButtonGroup,
    HStack,
    Spacer,
    Container,
    Heading,
    Center,
    useDisclosure,
    VStack,
    Text,
    Select,
    Box,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    ModalFooter,
} from '@chakra-ui/react';

import { Link, useNavigate } from 'react-router-dom';
import { AddIcon, EditIcon } from '@chakra-ui/icons';
import { MockAuth } from '../mockAuth/mockAuth';

function Groups() {
    const cancelRef = React.useRef();
    const navigate = useNavigate();
    const [groups, setGroups] = useState([]);
    const [filteredClass, setFilteredClass] = useState(["All"]);

  let authService = {
    "DEV": MockAuth,
    "TEST": useAuth0
  }

  const { getAccessTokenSilently } = authService[process.env.REACT_APP_AUTH]();

    // Confirmation popup for shuffling groups
    const {
        isOpen,
        onOpen,
        onClose
    } = useDisclosure();

    // Retrieve route parameters
    const {
        groupStrategy,
        groupSize,
        variance,
        unitCode,
        year,
        period
    } = useParams();

    const navigateToBelbinUpload = () => {
        navigate(`/upload/personality/${unitCode}/${year}/${period}`);
    };

    const navigateToWorkEthicUpload = () => {
        navigate(`/upload/personality/${unitCode}/${year}/${period}`);
    };

    const navigateToCreateGroups = () => {
        navigate(`/createGroups/${unitCode}/${year}/${period}`);
    }

    const navigateToStudentUploadInfo = () => {
        navigate(`/upload/students/${unitCode}/${year}/${period}`);
    }

    const navigateToUnitAnalytics = () => {
        navigate(`/unitAnalytics/${unitCode}/${year}/${period}`);
      }

    useEffect(() => {
      getAccessTokenSilently().then((token) => {
        fetch(`http://localhost:8080/api/groups/${unitCode}/${year}/${period}`,
        {
          method: 'get',
          headers: new Headers({
            'Authorization': `Bearer ${token}`
          })
        })
            .then((res) =>
                res.json().then(function (res) {
                    setGroups(res);
                })
            )
            .catch((err) => console.error(err));
        });
    }, []);

    let groupsDisplay = groups.length === 0 ?
        <Box bg='#E6EBF0' w='60vw' p={4} alignContent="center">
            <Center>
                No groups have been created for this offering. Click "Create/Reconfigure Groups" to create groups for the offering.
            </Center>
        </Box>
        :
        <Container className="groups" maxW="80vw">
            {groups.map((group) => {
                const cardKey = `${group.lab_number}_${group.group_number}`;
                console.log(typeof (filteredClass), typeof (group.lab_number))
                if (filteredClass == "All" | filteredClass == group.lab_number) {
                    return (<GroupCard groupData={group} numberOfGroups={groups.length} key={cardKey} />);
                }
            })}
        </Container>

    const classFilterOptions = [{ value: "All", label: "All labs" }]
    const foundClasses = []
    for (const group of groups) {
        if (foundClasses.indexOf(group.lab_number) === -1) {
            foundClasses.push(group.lab_number)
            classFilterOptions.push({ value: group.lab_number, label: `Lab ${group.lab_number}` })
        }
    }

    const handleExportToCSV = () => {

        /* creating the csv */
        const csvRows = [["Lab Number", "Group Number", "Student ID(s)"]];
        let newRow = [];
        for (const group of groups) {
            newRow.push(group.lab_number);
            newRow.push(group.group_number);
            for (const student of group.students) {
                newRow.push(student.student_id);
            }
            csvRows.push(newRow);
            newRow = [];
        }
        let csvContent = "data:text/csv;charset=utf-8,"
            + csvRows.map(e => e.join(",")).join("\n");

        /* downloading the csv file */
        try {
            var encodedUri = encodeURI(csvContent);
            var link = document.createElement("a");
            link.setAttribute("href", encodedUri);
            const file_name = `${unitCode}_${year}_${period}_groups.csv`;
            link.setAttribute("download", file_name);
            document.body.appendChild(link); // Required for FF
            link.click();
        } catch (error) {
            console.log(error);
        }

        console.log("should have downloaded")
    };

    const navigateToStudentUpload = () => {
        navigate(`/uploadStudents/${unitCode}/${year}/${period}`);
    };

    useEffect(() => {
        fetch(`http://localhost:8080/api/groups/${unitCode}/${year}/${period}`)
            .then((res) =>
                res.json().then(function (res) {
                    console.log(res)
                    setGroups(res);
                })
            )
            .catch((err) => console.error(err));
    }, []);

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
                        onClick={navigateToStudentUploadInfo}
                        colorScheme="gray"
                        margin-left="20">
                        <HStack>
                            <AddIcon />
                            <Spacer />
                            <Text>Import Students Data</Text>
                        </HStack>
                    </Button>
                    <Button
                        width="100%"
                        onClick={navigateToBelbinUpload}
                        colorScheme="gray"
                        margin-left="20">
                        <HStack>
                            <AddIcon />
                            <Spacer />
                            <Text>Import Personality Data</Text>
                        </HStack>
                    </Button>
                    <Button
                        width="100%"
                        onClick={navigateToWorkEthicUpload}
                        colorScheme="gray"
                        margin-left="20">
                        <HStack>
                            <AddIcon />
                            <Spacer />
                            <Text>Import Work Ethic Data</Text>
                        </HStack>
                    </Button>
                </VStack>


                <Spacer />

                <HStack m="40px">
                    <Spacer />
                    <ButtonGroup colorScheme="#282c34" variant="outline" size="lg" isAttached>
                        <Button isDisabled={true}>  Groups  </Button>
                        <Link to={`/students/${unitCode}/${year}/${period}`}>
                            <Button>
                                Students
                            </Button>
                        </Link>
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
                            margin-left="20">
                            <HStack>
                                <EditIcon />
                                <Spacer />
                                <Text>Create/Reconfigure Groups</Text>
                            </HStack>
                        </Button>
                        <Center><Text fontWeight={"semibold"}>Show Students from Class:</Text></Center>

                        <Select
                            value={filteredClass}
                            onChange={(event) => setFilteredClass(event.target.value)}
                        >
                            {classFilterOptions?.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </Select>
                    </VStack>
                </HStack>
            </HStack>
            <Center>
                <VStack>
                    {groups.length > 0 && (<Button onClick={handleExportToCSV}>Export group data to .csv</Button>)}
                    {groupsDisplay}
                </VStack>

            </Center>

        </div>
    );
}

export default Groups;
