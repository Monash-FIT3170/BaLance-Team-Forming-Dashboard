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
  
import questionContainer from '../components/faqPage/questionContainer.jsx';

let question = {
    title: '',
    body: ''
}

let questions = ['hello']

let questionDisplay = (
<Container 
    className="questions" 
    maxW="80vw" 
    p="10" 
    >
        
        {questions.map((question) => {
          return (<questionContainer title={question}/>)
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