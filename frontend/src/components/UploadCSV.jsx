// Upload CSV component
// props: isFileChosen, csvFile, handleClearSelection, handleUpload, setIsFileChosen
import * as React from 'react';
import { Box, Text, Flex, Button, Input, Icon } from '@chakra-ui/react';
import { FiUploadCloud } from 'react-icons/fi';

export class UploadCSV extends React.Component {
  render() {
    return (
      <Box
        width="50%"
        height="175px"
        borderRadius="md"
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        textAlign="center"
      >
        <Text fontFamily="Montserrat, sans-serif" fontWeight="bold" fontSize="2xl" mb={4}>
          Drag and Drop CSV file here
        </Text>
        <Box
          bg={this.props.isFileChosen ? '#00ADB5' : 'white'}
          borderRadius="md"
          width="80%"
          p={4}
          mb={4}
          fontWeight="bold"
          display="flex"
          flexDirection="column"
          justifyContent="center" // Center the content horizontally
          alignItems="center" // Center the content vertically
          border="2px dashed #00ADB5"
          color="#00ADB5"
          transition="color 0.3s ease"
          _hover={{ color: '#fff', bg: '#00ADB5', cursor: 'pointer' }}
          _focus={{ outline: 'none' }}
          cursor="pointer"
        >
          {this.props.csvFile ? (
            <>
              <Text color="white" mb={2}>
                File: {this.props.csvFile.name}{' '}
              </Text>
              <Button mb={2} colorScheme="red" onClick={this.props.handleClearSelection}>
                Clear Selection
              </Button>
            </>
          ) : (
            <Flex justifyContent="center" mx="auto">
              <Icon as={FiUploadCloud} boxSize={6} mr={2} />
              <Text> Upload </Text>
              <Input
                textColor="white"
                type="file"
                onChange={(e) => {
                  this.props.handleUpload(e);
                  this.props.setIsFileChosen(true);
                }}
                opacity={0}
                width="100%"
                height="100%"
                left={0}
                top={0}
                cursor="pointer"
              />
            </Flex>
          )}
        </Box>
      </Box>
    );
  }
}
