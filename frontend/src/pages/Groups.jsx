import GroupCard from '../components/GroupCard';
import { useParams } from 'react-router';
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
import { ShuffleGroups } from '../components/ShuffleGroups';
import { AddIcon, EditIcon } from '@chakra-ui/icons';

function Groups() {
    const cancelRef = React.useRef();
    const navigate = useNavigate();
    const [groups, setGroups] = useState([]);
    const [filteredClass, setFilteredClass] = useState([""]);

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
        navigate(`/belbinImport/${unitCode}/${year}/${period}`);
    };

    const navigateToCreateGroups = () => {
        navigate(`/createGroups/${unitCode}/${year}/${period}`);
    }

    const navigateToStudentUploadInfo = () => {
        navigate(`/infoImport/${unitCode}/${year}/${period}`);
    }

    useEffect(() => {
        fetch(`http://localhost:8080/api/groups/${unitCode}/${year}/${period}`)
            .then((res) =>
                res.json().then(function (res) {
                    setGroups(res);
                })
            )
            .catch((err) => console.error(err));
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
                console.log(typeof(filteredClass), typeof(group.lab_number))
                if (filteredClass == "All" | filteredClass == group.lab_number) {
                    return (<GroupCard groupData={group} numberOfGroups={groups.length} key={cardKey} />);
                }
            })}
        </Container>

    const classFilterOptions = [{value: "All", label: "All labs"}]
    const foundClasses = []
    for (const group of groups) {
        if (foundClasses.indexOf(group.lab_number) === -1) {
            foundClasses.push(group.lab_number)
            classFilterOptions.push({ value: group.lab_number, label: `Lab ${group.lab_number}` })
        }
    }

    return (
        <div>
            <Heading alignContent={'center'}>
                <Center margin="10">{unitCode}</Center>
            </Heading>

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
                            <Text>Add Students</Text>
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
                            <Text>Add Personality Data</Text>
                        </HStack>
                    </Button>
                    <Button
                        width="100%"
                        onClick={navigateToStudentUploadInfo}
                        colorScheme="gray"
                        margin-left="20">
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
                    {groups.length > 0 && (<Button>Export group data to .csv</Button>)}
                    {groupsDisplay}
                </VStack>

            </Center>

        </div>
    );
}

export default Groups;
