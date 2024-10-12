import React from 'react';
import { Spinner, Flex } from '@chakra-ui/react';

const LoadingSpinner = () => (
  <Flex justify="center" align="center" height="100vh">
    <Spinner
      thickness="4px"
      speed="0.65s"
      emptyColor="gray.200"
      color="blue.500"
      size="xl"
    />
  </Flex>
);

export default LoadingSpinner;