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
  const { groupStrategy, groupSize, variance, unitCode, year, period } = useParams();

  const navigate = useNavigate();

  // Confirmation popup for shuffling groups
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = React.useRef();

  const handleUploadClick = () => {
    navigate(`/uploadStudents/${unitCode}/${year}/${period}`);
  };

  const [groups, setGroups] = useState([]);

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
    // TODO will the backend need to handle this differently given students aren't new?
    fetch(`http://localhost:8080/api/groups/'${unitCode}/${year}/${period}`, {
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
        <Center margin="10">{unitCode}</Center>
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
            <Link to={`/students/${unitCode}/${year}/${period}`}>
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
        {groups.map((group) => (
          <GroupCard groupData={group} key={group.id} />
        ))}
      </Container>
    </div>
  );
}

export default Groups;
