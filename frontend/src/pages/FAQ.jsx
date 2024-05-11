import {
  VStack,
  Box,
  Spacer,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
} from '@chakra-ui/react';

import { PageHeader } from '../components/_shared';
import QuestionContainer from '../components/faqPage/questionContainer';
import questionData from '../data/questions.json';
import { hydrateQuestionJSON } from '../components/faqPage/hydrateQuestion';

let questions = hydrateQuestionJSON(questionData);

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
    <VStack>
      <PageHeader fontSize="4xl" pageDesc="Frequently Asked Questions" />
      {questionDisplay(questions)}
    </VStack>
  );
}
