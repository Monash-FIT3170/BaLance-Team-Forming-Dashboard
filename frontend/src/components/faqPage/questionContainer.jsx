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
  } from '@chakra-ui/react';

const QuestionContainer = ({title, body}) => {
    return (
    <Flex
    alignItems="left"
    pl="1em">
      <VStack alignItems = "left" pl = '5'>
        <Text 
        fontSize = '5xl'
        style={{ 
          color: '#24265D',
          'font-family': 'Helvetica' }}
          as='b'>
          {title}
        </Text>
        <Spacer/>
        {body.map((b) => {
            return (<VStack alignItems='left'>
              <Text 
                fontSize = '3xl'
                style={{ 
                  color: '#24265D',
                  'font-family': 'Helvetica' }}
                as='b'
                >
                  {b.header}
              </Text>
              {b.bodyText}
              <Spacer/>
              </VStack>
              
              )
            })}
      </VStack>
    </Flex>

  );
};

export default QuestionContainer;