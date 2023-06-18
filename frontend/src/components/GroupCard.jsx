/* 
Group card needs to:
    - import StudentRow
    - extract from its props the group data
    - loop through each student in the group  
    - for each student, a Student Row component needs to be instantiated 
    - the student's details (found from the group data) need to be passed into the StudentRow component via props
        - e.g. <Student firstName=_firstName email=_email classNum=_classNum wamAverage=_wamAverage enrolmentStatus=_enrolmentStatus discPersonality=_discPersonality > 
*/
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

const GroupCard = ({groupData}) => {
  // console.log(groupData)
  const {
    labNumber,
    groupNumber,
    students
  } = groupData;

  return (
    <Card border="1px" margin="20px">
      <CardHeader>
        <HStack>
          <Heading>
            Lab: {labNumber} Group: {groupNumber}
          </Heading>
          <Spacer />
        </HStack>
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
                  key={student.studentId}
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
