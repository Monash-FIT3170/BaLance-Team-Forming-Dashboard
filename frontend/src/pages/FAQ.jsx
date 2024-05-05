import {
    HStack,
    Container,
    Flex,
    Center,
    VStack,
    Text,
    Select,
    Box,
    useToast,
    Spacer,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td
  } from '@chakra-ui/react';
  
import QuestionContainer from '../components/faqPage/questionContainer';



let questionBody1 = {
    header: 'Student Data: ',
    bodyText: <Box>
            <VStack alignItems = 'left' pl = '10'>
                <ul>
                        <li style = {{'font-size': '20px'}}>
                            <Text
                            fontSize = 'xl'
                            style={{ 
                            color: '#24265D',
                            'font-family': 'Helvetica' }}>
                                studentId must be an 8-digit number
                            </Text>
                        </li>
                        <li style = {{'font-size': '20px'}}>
                            <Text
                            fontSize = 'xl'
                            style={{ 
                            color: '#24265D',
                            'font-family': 'Helvetica' }}>
                                labCode must be prefixed by the number and '_' minimally
                            </Text>
                        </li>
                        <li style = {{'font-size': '20px'}}>
                            <Text
                            fontSize = 'xl'
                            style={{ 
                            color: '#24265D',
                            'font-family': 'Helvetica' }}>
                                gender must be a single char
                            </Text>
                        </li>
                    </ul>
                </VStack>
                <Table variant = 'striped' size = 'md'>
                    <Thead>
                        <Tr>
                            <Th>studentId</Th>
                            <Th>labCode</Th>
                            <Th>lastName</Th>
                            <Th>preferredName</Th>
                            <Th>email</Th>
                            <Th>wam</Th>
                            <Th>gender</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        <Tr>
                            <Td>12345678</Td>
                            <Td>01_DualMode</Td>
                            <Td>White</Td>
                            <Td>Jim</Td>
                            <Td>jwhi0001@student.monash.edu</Td>
                            <Td>93</Td>
                            <Td>M</Td>
                        </Tr>
                        <Tr>
                            <Td>28462818</Td>
                            <Td>02_DualMode</Td>
                            <Td>Black</Td>
                            <Td>Jemma</Td>
                            <Td>jbla0001@student.monash.edu</Td>
                            <Td>93</Td>
                            <Td>F</Td>
                        </Tr>
                    </Tbody>
                </Table>
            </Box>
}

let questionBody2 = {
    header: 'Belbin Data: ',
    bodyText: <Box>
                <Text
                fontSize = 'xl'
                style={{ 
                color: '#24265D',
                'font-family': 'Helvetica' }}>
                    Belbin Team roles is a theory developed by Dr. Meredith Belbin, where these roles describe the behavioural patterns that people exhibit within teams, highlighting their strengths and weaknesses.
                    <br></br>
                    Belbin type must be one of people, thinking or action:
                </Text>
                <Table variant = 'striped' size = 'lg'>
                    <Thead>
                        <Tr>
                            <Th>studentId</Th>
                            <Th>belbintype</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        <Tr>
                            <Td>12345678</Td>
                            <Td>People</Td>
                        </Tr>
                        <Tr>
                            <Td>28462818</Td>
                            <Td>Thinking</Td>
                        </Tr>
                    </Tbody>
                </Table>
            </Box>
}

let questionBody3 = {
    header: 'Effort Data: ',
    bodyText: <Box>
                <Text
                fontSize = 'xl'
                style={{ 
                color: '#24265D',
                'font-family': 'Helvetica' }}>
                    Hours commitment is the estimated number of hours that a student expects to commit in a week.
                </Text>
                <Table variant = 'striped' size = 'lg'>
                    <Thead>
                        <Tr>
                            <Th>studentId</Th>
                            <Th>hourCommitment</Th>
                            <Th>avgAssignmentMark</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        <Tr>
                            <Td>12345678</Td>
                            <Td>13</Td>
                            <Td>73</Td>
                        </Tr>
                        <Tr>
                            <Td>28462818</Td>
                            <Td>18</Td>
                            <Td>84</Td>
                        </Tr>
                    </Tbody>
                </Table>
            </Box>
}

let question1 = {
    title: 'What type of CSV data are accepted?',
    b: [questionBody1, questionBody2, questionBody3]
}

let questionBody4 = {
    header: '',
    bodyText: <Text
            fontSize = 'xl'
            style={{ 
            color: '#24265D',
            'font-family': 'Helvetica' }}>
                yada yada yada
            </Text>
}

let question2 = {
    title: 'How are users grouped?',
    b: [questionBody4]
}

let questions = [question1, question2]

let questionDisplay = (

    <Container 
        className="questions" 
        maxW='2000px'
        p="3" 
        >
            
            {questions.map((question) => {
            return ( <Box><QuestionContainer title={question.title} body = {question.b}/><Spacer/></Box>
                )
            })}
        
        
        
    </Container>)

const FAQ = () => {
    return (
        <Flex>
            <VStack>
                {questionDisplay}
            </VStack>
        </Flex>
    )
};

export default FAQ