import {
  VStack,
  Box,
  Spacer,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Button,
  HStack,
} from '@chakra-ui/react';
import { useState } from 'react';

import { PageHeader } from '../components/_shared';
import QuestionContainer from '../components/faqPage/questionContainer';
import questionData from '../data/questions.json';
import { hydrateQuestionJSON } from '../components/faqPage/hydrateQuestion';

let questions = hydrateQuestionJSON(questionData);

export function questionDisplay(questionList) {
  const [accordionState, toggleAccordion] = useState([]);
  let accordionCount = [...Array(questionList.length).keys()];

  return (
    <Accordion
      allowToggle
      allowMultiple='true'
      index={accordionState}
      onChange={toggleAccordion}
      width="80%"
      marginTop="5rem"
    >
      <HStack alignItems="left" pl="3" pb="3" spacing="3">
        <Button onClick={() => toggleAccordion(accordionCount)} variant="link">
          Expand All
        </Button>
        <Button onClick={() => toggleAccordion([])} variant="link">
          Collapse All
        </Button>
      </HStack>
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
              <QuestionContainer body={question.b} />
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
    <Box>
      <PageHeader fontSize="4xl" pageDesc="Frequently Asked Questions" />
      <VStack>{questionDisplay(questions)}</VStack>
    </Box>
  );
}
