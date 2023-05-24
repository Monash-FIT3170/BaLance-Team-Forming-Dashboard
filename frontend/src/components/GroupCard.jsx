import { Card, CardBody, CardHeader, Table, Thead, Tbody, Tr, Th, TableContainer, Heading, Spacer, HStack } from "@chakra-ui/react"
import StudentRow from './StudentRowGroupDisplay'

const GroupCard = (props) => {

    const { labId, groupId, groupNumber, members } = props.props;
    const { allIds } = props;

    return (
        <Card border="1px" margin="20px">
            <CardHeader>
                <HStack>
                    <Heading>Lab: {labId}, Group: {groupNumber}</Heading>
                    <Spacer />
                </HStack>
            </CardHeader>

            <CardBody margin="15px">
                <TableContainer>
                    <Table variant='striped'>
                        <Thead>
                            <Tr>
                                <Th></Th>
                                <Th>Name</Th>
                                <Th>Email Address</Th>
                                <Th>WAM average</Th>
                                <Th>Enrolment Status</Th>
                                <Th>DISC Personality</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {members.map(student => (
                                <StudentRow studentInfo={student} classNum={labId} groupNum={groupNumber} key={student._id} groupId={groupId} allIds={allIds} />
                            ))}
                        </Tbody>
                    </Table>
                </TableContainer>
            </CardBody>
        </Card>
    )

}
export default GroupCard