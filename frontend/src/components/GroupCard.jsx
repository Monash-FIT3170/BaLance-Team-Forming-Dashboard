import {
  Card,
  CardBody,
  CardHeader,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  TableContainer,
  Heading,
  Spacer,
  HStack,
  Button,
} from '@chakra-ui/react';
import { useParams } from 'react-router';
import StudentRowGroupDisplay from './StudentRowGroupDisplay';
import { useNavigate } from 'react-router-dom';

const GroupCard = ({groupData, numberOfGroups}) => {
  const {
    lab_number,
    group_number,
    students
  } = groupData;

  const {
    unitCode,
    year,
    period
  } = useParams();

  const navigate = useNavigate();
  const navigateToGroupAnalytics = () => {
    navigate(`/groupAnalytics/${unitCode}/${year}/${period}/${lab_number}/${group_number}`);
  };

  return (
    <Card border="1px" margin="20px">
      <CardHeader>
        <Heading>
          Lab: {lab_number}, Group: {group_number}
        </Heading>
      <Button
        me="12px"
        align="right"
        justify="right"
        borderRadius="12px"
        style={{ position: 'absolute', top: 25, right: 10 }}
        onClick={navigateToGroupAnalytics}
        colorScheme="green">
        <HStack><p>Group Analytics</p></HStack>
      </Button>
        <Spacer />
      </CardHeader>

      <CardBody margin="15px">
        <TableContainer>
          <Table variant="striped">
            <Thead>
              <Tr>
                <Th></Th>
                <Th>ID</Th>
                <Th>Preferred Name</Th>
                <Th>Last Name</Th>
                <Th>Email Address</Th>
                <Th>WAM</Th>
              </Tr>
            </Thead>
            <Tbody>
              {students.map((student) => {
                student['group_number'] = group_number
                // console.log(student)
                return (
                  <StudentRowGroupDisplay
                      studentData={student}
                      numberOfGroups={numberOfGroups}
                      key={student.student_id}
                  />
                );
              })}
            </Tbody>
          </Table>
        </TableContainer>
      </CardBody>
    </Card>
  );
};
export default GroupCard;
