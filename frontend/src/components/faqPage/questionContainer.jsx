import { Flex, VStack, Text, Spacer } from '@chakra-ui/react';

const QuestionContainer = ({ body }) => {
  return (
    <VStack alignItems="left" pl="5">
      {body.map((b) => {
        return (
          <VStack alignItems="left">
            <Text fontSize="xl" as="b">
              {b.header}
            </Text>
            <Text fontSize="lg">{b.bodyText}</Text>
            <Spacer />
          </VStack>
        );
      })}
      <Spacer />
    </VStack>
  );
};

export default QuestionContainer;
