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
} from '@chakra-ui/react';
import StudentRowGroupDisplay from './StudentRowGroupDisplay';

const GroupCard = ({groupData, numberOfGroups}) => {
  const {
    labNumber,
    groupNumber,
    students
  } = groupData;

  return (
    <Card border="1px" margin="20px">
      <CardHeader>
        <Heading>
          Lab: {labNumber} Group: {groupNumber}
        </Heading>
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
              {students.map((student) => (
                <StudentRowGroupDisplay
                  studentData={student}
                  key={student.student_id}
                />
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      </CardBody>
    </Card>
  );
};
export default GroupCard;
