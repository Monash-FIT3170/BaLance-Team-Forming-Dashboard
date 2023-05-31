import React, { useState, useEffect } from 'react';
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
  Spacer,
  Heading,
  Center,
  useDisclosure,
} from '@chakra-ui/react';
import StudentRow2 from '../components/StudentRowStudentDisplay';
import { Link, useNavigate } from 'react-router-dom';
import { ShuffleGroups } from '../components/ShuffleGroups';

function Students() {
  const [allStudents, setStudents] = useState([]);
  const [allGroups, setAllGroups] = useState([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = React.useRef();
  const navigate = useNavigate();
  const { groupStrategy, groupSize, variance, unitCode, year, period } = useParams();

  const handleUploadClick = () => {
    navigate(`/uploadStudents/${unitCode}/${year}/${period}`);
  };

  useEffect(() => {
    const labs = [];

    fetch(`http://localhost:8080/api/students/${unitCode}/${year}/${period}`)
      .then((res) => res.json().then((res) => setStudents(res)))
      .catch((err) => console.error(err));

    fetch(`http://localhost:8080/api/groups/${unitCode}/${year}/${period}`)
      .then((res) =>
        res.json().then(function (res) {
          for (let i = 0; i < res.length; i++) {
            labs.push({
              labId: res[i].labId,
              groupNumber: res[i].groupNumber,
              groupId: res[i].groupId,
              members: res[i].members,
            });
          }
          setAllGroups(labs);
        })
      )
      .catch((err) => console.error(err));
  }, []);

  const handleShuffleGroups = () => {
    // Close confirmation dialog
    onClose();

    // API call to create groups from scratch - will automatically delete existing groups first
    fetch(`http://localhost:8080/api/groups/${unitCode}/${year}/${period}`, {
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
            <Link to={`/groups/${unitCode}/${year}/${period}`}>
              <Button margin="0px 2px">Groups</Button>
            </Link>
            <Button margin="0px 2px" isDisabled={true}>
              Students
            </Button>
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

      <Center>
        <Table variant="striped" width="80vw">
          <Thead>
            <Tr>
              <Th>Name</Th>
              <Th>Email Address</Th>
              <Th>Class Number</Th>
              <Th>Group Number</Th>
            </Tr>
          </Thead>
          <Tbody>
            {allStudents.map((student) => (
              <StudentRow2
                props={student}
                studentInfo={student}
                key={student.id}
                allLabs={allGroups}
              />
            ))}
          </Tbody>
        </Table>
      </Center>
    </div>
  );
}

export default Students;
