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
} from '@chakra-ui/react';

import { Link, useNavigate } from 'react-router-dom';
import { ShuffleGroups } from '../components/ShuffleGroups';
import { AddIcon, EditIcon } from '@chakra-ui/icons';

function Groups() {
  const cancelRef = React.useRef();
  const navigate = useNavigate();
  const [groups, setGroups] = useState([]);

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

  const navigateToStudentUpload = () => {
    navigate(`/uploadStudents/${unitCode}/${year}/${period}`);
  };

  const navigateToBelbinUpload = () => {
    navigate(`/belbinImport/${unitCode}/${year}/${period}`);
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

  const handleShuffleGroups = () => {
    // Close confirmation dialog
    onClose();

    // API call to create groups from scratch - will automatically delete existing groups first
    // then call createUnitGroups under the hood
    fetch(`http://localhost:8080/api/groups/shuffle/${unitCode}/${year}/${period}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        groupSize: groupSize,
        variance: variance,
        strategy: groupStrategy,
      })
    })
      .then((res) => res.json())
      .catch((error) => {
        console.error('Error:', error);
      })
      .finally(() => {
        // Reload the page
        window.location.reload();
      });
  };

  let groupsDisplay = groups.length === 0 ?
    <Box bg='#E6EBF0' w='60%' p={4} alignContent="center">
      <Center>
        No students have yet been added to the offering. Click "Add Students" to add students to the offering.
      </Center>
    </Box>
    :
    <Container className="groups" maxW="80vw">
      {groups.map((group) => {
        const cardKey = `${group.lab_number}_${group.group_number}`;
        return (<GroupCard groupData={group} numberOfGroups={17} key={cardKey} />);
      })}
    </Container>

  return (
    <div>
      <Heading alignContent={'center'}>
        <Center margin="10">{unitCode}</Center>
      </Heading>

      <HStack margin="0px 20vw 5vh 20vw" alignContent={'center'}>
        <VStack>
          <Button
            width="100%"
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
            onClick={navigateToBelbinUpload}
            colorScheme="gray"
            margin-left="20">
            <HStack>
              <AddIcon />
              <Spacer />
              <Text>Add Personality Data</Text>
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
              width="100%"
              onClick={navigateToStudentUpload}
              colorScheme="gray"
              margin-left="20">
              <HStack>
                <EditIcon />
                <Spacer />
                <Text>Create/Reconfigure Groups</Text>
              </HStack>
            </Button>
            <Button
              width="100%"
              onClick={navigateToStudentUpload}
              colorScheme="gray"
              margin-left="20">
              <HStack>
                <AddIcon />
                <Spacer />
                <Text>Show Students from Class:</Text>
              </HStack>
            </Button>
            <Select
              placeholder={`${groups.length}`}
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
        {groupsDisplay}
      </Center>
      
    </div>
  );
}

export default Groups;
