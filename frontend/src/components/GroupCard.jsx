/* 
Group card needs to:
    - import StudentRow
    - extract from its props the group data
    - loop through each student in the group  
    - for each student, a Student Row component needs to be instantiated 
    - the student's details (found from the group data) need to be passed into the StudentRow component via props
        - e.g. <Student firstName=_firstName email=_email classNum=_classNum wamAverage=_wamAverage enrolmentStatus=_enrolmentStatus discPersonality=_discPersonality > 
*/
import {Card, CardBody, CardHeader, Table, Thead,Tbody,Tr,Th,Td,TableContainer,Heading, Center, Spacer, HStack} from "@chakra-ui/react"
import { AddIcon } from '@chakra-ui/icons'
import StudentRow from './StudentRow'

const GroupCard = (props) =>{
    const {labId, groupId, groupNumber, members} = props.props



    return (
        <Card border="1px" marginX="20px" marginBottom="20px">
            <CardHeader>
                <HStack>
                    <Heading>Lab: {labId} Group: {groupNumber} Group ID: {groupId}</Heading>
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
                                <Th>Lab Number</Th>
                                <Th>WAM average</Th>
                                <Th>Enrolment Status</Th>
                                <Th>DISC Personality</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {members.map(student =>(
                                <StudentRow props = {student} key = {student._id}/>
                            ))}
                            <Tr>
                                <Td colspan="7">
                                    <Center>
                                        <button><AddIcon /></button>
                                    </Center>
                                </Td>
                            </Tr>
                        </Tbody>
                    </Table>
                </TableContainer>
            </CardBody>
        </Card>
    )
}
export default GroupCard