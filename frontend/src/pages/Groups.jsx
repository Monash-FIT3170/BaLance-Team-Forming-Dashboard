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
} from '@chakra-ui/react';

import { Link, useNavigate } from 'react-router-dom';
import { ShuffleGroups } from '../components/ShuffleGroups';

function Groups() {
  // Retrieve route parameters
  const { groupStrategy, groupSize, variance, unitID } = useParams();

  const navigate = useNavigate();

  // Confirmation popup for shuffling groups
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = React.useRef();

  const handleUploadClick = () => {
    navigate('/uploadStudents/' + unitID);
  };

  const [state, setState] = useState([]);
  const [allGroups, setAllGroups] = useState([]);

  useEffect(() => {
    const summary = [];

    fetch('http://localhost:8080/api/groups/' + unitID)
      .then((res) =>
        res.json().then(function (res) {
          setState(res);

          for (let i = 0; i < res.length; i++) {
            summary.push({
              labId: res[i].labId,
              groupNumber: res[i].groupNumber,
              groupId: res[i].groupId,
            });
          }

          setAllGroups(summary);
        })
      )
      .catch((err) => console.error(err));
  }, []);

  const handleShuffleGroups = () => {
    // Close confirmation dialog
    onClose();

    // API call to create groups from scratch - will automatically delete existing groups first
    fetch('http://localhost:8080/api/groups/' + unitID, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        groupSize: groupSize,
        variance: variance,
        strategy: groupStrategy,
      }),
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

  return (
    <div>
      <Heading alignContent={'center'}>
        <Center margin="10">{unitID}</Center>
      </Heading>

      <HStack margin="0px 20vw 5vh 20vw">
        <Button onClick={handleUploadClick} colorScheme="gray" margin-left="20">
          Upload Students
        </Button>

        <Spacer />

        <HStack m="40px">
          <Spacer />
          <ButtonGroup colorScheme="#282c34" variant="outline" size="lg">
            <Button margin="0px 2px" isDisabled={true}>
              Groups
            </Button>
            <Link to={'/students/' + unitID}>
              <Button margin="0px 2px">Students</Button>
            </Link>
          </ButtonGroup>
          <Spacer />
        </HStack>
        <Spacer />
        <ShuffleGroups
          onOpen={onOpen}
          onClose={onClose}
          isOpen={isOpen}
          cancelRef={cancelRef}
          handleShuffleGroups={handleShuffleGroups}
        />
      </HStack>

      <Container className="groups" maxW="80vw">
        {state.map((group) => (
          <GroupCard props={group} key={group.id} allIds={allGroups} />
        ))}
      </Container>
    </div>
  );
}

export default Groups;
