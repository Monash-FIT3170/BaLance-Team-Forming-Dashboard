import {
    Container,
    Flex,
    VStack,
    Text,
    Box,
    Spacer,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    Heading
  } from '@chakra-ui/react';
  
import QuestionContainer from '../components/faqPage/questionContainer';

let questionBody1 = {
    header: 'Student Data: ',
    bodyText: <Box>
            <VStack alignItems = 'left' pl = '10'>
                <Box>
                    <ul>
                            <li>
                                <Text>
                                    studentId must be an 8-digit number
                                </Text>
                            </li>
                            <li>
                                <Text>
                                    labCode must be prefixed by the number and '_' minimally
                                </Text>
                            </li>
                            <li>
                                <Text>
                                    gender must be a single char
                                </Text>
                            </li>
                        </ul>
                        </Box>
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
                <Text>
                    Belbin Team roles is a theory developed by Dr. Meredith Belbin, where these roles describe the behavioural patterns that people exhibit within teams, highlighting their strengths and weaknesses.
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
                <Text>
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
    bodyText: <Text>
                yada yada yada
            </Text>
}

let question2 = {
    title: 'How are users grouped?',
    b: [questionBody4]
}

let questions = [question1, question2]

export function questionDisplay(questionList) {

    return (<Container 
        className="questions" 
        maxW='1880'
        p="3" 
        >
            
            {questionList.map((question) => {
            return ( <Box><QuestionContainer title={question.title} body = {question.b}/><Spacer/></Box>
                )
            })}
        
        
        
    </Container>)
    }

export default function FAQ () {
    return (
        <Flex>
            <VStack>
                <Text style={{ 
            color: '#24265D',
            'font-family': 'Helvetica',
            'font-size': 200 }} 
            as='b'>
                    FAQ
                </Text>
                {questionDisplay(questions)}
            </VStack>
        </Flex>
    )
};

