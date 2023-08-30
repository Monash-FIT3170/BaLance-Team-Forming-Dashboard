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
} from '@chakra-ui/react';

import { Link, useNavigate } from 'react-router-dom';
import { ShuffleGroups } from '../components/ShuffleGroups';
import { AddIcon, EditIcon } from '@chakra-ui/icons';
import { MockAuth } from '../mockAuth/mockAuth';

function Groups() {
  const cancelRef = React.useRef();
  const navigate = useNavigate();
  const [groups, setGroups] = useState([]);

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

  const navigateToStudentUpload = () => {
    navigate(`/uploadStudents/${unitCode}/${year}/${period}`);
  };

  const navigateToBelbinUpload = () => {
    navigate(`/belbinImport/${unitCode}/${year}/${period}`);
  };

  const navigateToCreateGroups = () => {
    navigate(`/createGroups/${unitCode}/${year}/${period}`);
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
          console.log(res)
          setGroups(res);
        })
      )
      .catch((err) => console.error(err));
      });
    }, []);

  const handleShuffleGroups = () => {
    // Close confirmation dialog
    onClose();

    getAccessTokenSilently().then((token) => {
    // API call to create groups from scratch - will automatically delete existing groups first
    // then call createUnitGroups under the hood
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
    <Box bg='#E6EBF0' w='60vw' p={4} alignContent="center">
      <Center>
        No groups have been created for this offering. Click "Create/Reconfigure Groups" to create groups for the offering.
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
            margin-left="20">
            <HStack>
              <AddIcon />
              <Spacer />
              <Text>Add Personality Data</Text>
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
        <VStack>
          {groups.length > 0 && (<Button>Export group data to .csv</Button>)}
          {groupsDisplay}
        </VStack>

      </Center>

    </div>
  );
}

export default Groups;
