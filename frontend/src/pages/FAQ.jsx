import {
  Container,
  Flex,
  VStack,
  Text,
  Box,
  Spacer,
  TableContainer,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Heading,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
} from '@chakra-ui/react';

import { PageHeader } from '../components/_shared';
import QuestionContainer from '../components/faqPage/questionContainer';

let questionBody1 = {
  header: 'Student Data: ',
  bodyText: (
    <Box>
      <VStack alignItems="left" pl="10">
        <Box>
          <ul>
            <li>
              <Text>studentId must be an 8-digit number</Text>
            </li>
            <li>
              <Text>labCode must be prefixed by the number and '_' minimally</Text>
            </li>
            <li>
              <Text>gender must be a single char</Text>
            </li>
          </ul>
        </Box>
      </VStack>
      <TableContainer>
        <Table variant="striped">
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
      </TableContainer>
    </Box>
  ),
};

let questionBody2 = {
  header: 'Belbin Data: ',
  bodyText: (
    <Box>
      <Text>
        Belbin Team roles is a theory developed by Dr. Meredith Belbin, where these roles
        describe the behavioural patterns that people exhibit within teams, highlighting
        their strengths and weaknesses. Belbin type must be one of people, thinking or
        action:
      </Text>
      <TableContainer>
        <Table variant="striped">
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
      </TableContainer>
    </Box>
  ),
};

let questionBody3 = {
  header: 'Effort Data: ',
  bodyText: (
    <Box>
      <Text>
        Hours commitment is the estimated number of hours that a student expects to commit
        in a week.
      </Text>
      <TableContainer>
        <Table variant="striped">
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
      </TableContainer>
    </Box>
  ),
};

let question1 = {
  title: 'What type of CSV data are accepted?',
  b: [questionBody1, questionBody2, questionBody3],
};

let questionBody4 = {
  header: '',
  bodyText: <Text>yada yada yada</Text>,
};

let question2 = {
  title: 'How are users grouped?',
  b: [questionBody4],
};

let questions = [question1, question2];

export function questionDisplay(questionList) {
  return (
    <Accordion allowMultiple width="80%" marginTop="5rem">
      {questionList.map((question) => {
        return (
          <AccordionItem>
            <h2>
              <AccordionButton>
                <Box flex="1" textAlign="left" fontSize="3xl">
                  {question.title}
                </Box>
                <AccordionIcon />
              </AccordionButton>
            </h2>
            <AccordionPanel pb={4}>
              <QuestionContainer title={question.title} body={question.b} />
            </AccordionPanel>
            <Spacer />
          </AccordionItem>
        );
      })}
    </Accordion>
  );
}

export default function FAQ() {
  return (
    <VStack>
      <PageHeader fontSize="4xl" pageDesc="Frequently Asked Questions" />
      {questionDisplay(questions)}
    </VStack>
  );
}
