// Upload CSV component
// props: isFileChosen, csvFile, handleClearSelection, handleUpload, setIsFileChosen
import * as React from 'react';
import { Box, Text, Flex, Button, Input, Icon, HStack } from '@chakra-ui/react';
import { FiUploadCloud } from 'react-icons/fi';

export class UploadCSV extends React.Component {
  render() {
    return (

      this.props.csvFile ? (
        <>
          <Text color="white" mb={2}>
            File: {this.props.csvFile.name}{' '}
          </Text>
          <Button mb={2} colorScheme="red" onClick={this.props.handleClearSelection}>
            Clear Selection
          </Button>
        </>
      ) : (
          <>
          <HStack>
            <FiUploadCloud/>
            <Text>Upload your .csv file below</Text>
          </HStack>
          <Box
            bg={this.props.isFileChosen ? '#00ADB5' : 'white'}
            borderRadius="md"
            width="90%"
            m="0"
            fontWeight="bold"
            display="flex"
            flexDirection="column"
            justifyContent="center" // Center the content horizontally
            alignItems="center" // Center the content vertically
            border="2px dashed #24265D"
            color="#F0EDE7"
            transition="color 0.3s ease"
            _hover={{bg: '#E2E8F0', cursor: 'pointer' }}
            cursor="pointer"
          >
            <Input
              textColor="white"
              type="file"
              onChange={(e) => {
                this.props.handleUpload(e);
                this.props.setIsFileChosen(true);
              }}
              opacity={0}
              left={0}
              top={0}
              cursor="pointer"
              focusBorderColor='black'
            />
          </Box></>
          


        )
      

    );
  }
}
