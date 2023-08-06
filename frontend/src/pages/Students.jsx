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
import StudentRowStudentDisplay from '../components/StudentRowStudentDisplay';
import { Link, useNavigate } from 'react-router-dom';
import { ShuffleGroups } from '../components/ShuffleGroups';

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

  useEffect(() => {
    // fetch students from the backend
    fetch(`http://localhost:8080/api/students/${unitCode}/${year}/${period}`)
      .then((res) => res.json())
      .then((res) => {
        console.log(res);
        setStudents(res);
      })
      .catch((err) => console.error(err));

    // determine the number of groups in this unit offering
    setNumberOfGroups(
        // convert each student object to just student.group_number then find the max
        Math.max(...students.map(student => student.group_number))
    )
  }, []);

  const handleShuffleGroups = () => {
    // Close confirmation dialog
    onClose();

    // API call to create groups from scratch - will automatically delete existing groups first
    fetch(`http://localhost:8080/api/groups/shuffle/${unitCode}/${year}/${period}`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        groupSize: groupSize,
        variance: variance,
        strategy: groupStrategy,
      })
    })
    .catch((error) => {console.error('Error:', error);})
    .finally(() => {window.location.reload();});
  }

  return (
    <div>
      <Heading alignContent={'center'}>
        <Center margin="10">{unitCode}</Center>
      </Heading>

      <HStack margin="0px 20vw 5vh 20vw" alignContent={'center'}>
        <Button
          onClick={navigateToStudentUpload}
          colorScheme="gray"
          margin-left="20">
          Upload Students
        </Button>

        <Spacer />

        <HStack m="40px">
          <Spacer />
          <ButtonGroup colorScheme="#282c34" variant="outline" size="lg" isAttached>
            <Link to={`/groups/${unitCode}/${year}/${period}`}>
              <Button >  Groups  </Button>
            </Link>
            <Button isDisabled={true}>
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
              <Th>ID</Th>
              <Th>Preferred Name</Th>
              <Th>Last Name</Th>
              <Th>Email Address</Th>
              <Th>Group</Th>
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
      </Center>
    </div>
  );
}

export default Students;
