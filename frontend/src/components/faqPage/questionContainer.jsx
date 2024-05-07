import {
    Flex,
    VStack,
    Text,
    Spacer
  } from '@chakra-ui/react';

const QuestionContainer = ({title, body}) => {
    return (
    <Flex
    alignItems="left"
    pl="1em"
    style = {{
      'font-family': 'Helvetica',
      color: '#24265D'
    }}>
      <VStack alignItems = "left" pl = '5'>
        <Text 
        fontSize = '5xl'
          as='b'>
          {title}
        </Text>
        <Spacer/>
        {body.map((b) => {
            return (<VStack alignItems='left'>
              <Text 
                fontSize = '3xl'
                as='b'
                >
                  {b.header}
              </Text>
              <Text fontSize = 'xl'>
                  {b.bodyText}
                </Text>
              <Spacer/>
              </VStack>
              
              )
            })}
        <Spacer/>
      </VStack>
    </Flex>

  );
};

export default QuestionContainer;