// Upload CSV component
// props: isFileChosen, csvFile, handleClearSelection, handleUpload, setIsFileChosen
import * as React from 'react';
import {
  Box, Text, Button, Input, HStack, ButtonGroup, Link
} from '@chakra-ui/react';
import { FiUploadCloud } from 'react-icons/fi';

export class UploadCSV extends React.Component {
  render() {
    return (

      this.props.csvFile ? (
        <>
          <Text color="white" mb={2}>
            File: {this.props.csvFile.name}{' '}
          </Text>
          <ButtonGroup>
            <Button mb={2} colorScheme="red" onClick={this.props.handleClearSelection}>
                    Clear        
            </Button>
            <Button onClick={this.props.handleAddProfilesClick}>
              Add To Offering
            </Button>
          </ButtonGroup>

        </>
      ) : (
        <>
          <HStack>
            <FiUploadCloud />
            <Text>Submit a .csv file below to add students to the offering</Text>
          </HStack>
          <Box
            bg={this.props.isFileChosen ? '#00ADB5' : 'white'}
            borderRadius="md"
            width="100%"
            margin="0 3vw 5vw 3vw"
            fontWeight="bold"
            display="flex"
            flexDirection="column"
            justifyContent="center" // Center the content horizontally
            alignItems="center" // Center the content vertically
            border="2px dashed #24265D"
            color="black"
            transition="color 0.3s ease"
            _hover={{ bg: '#E2E8F0', cursor: 'pointer' }}
            onDrop={(e) => {
              this.props.handleDrop(e);
            }}
            onDragOver={(e) => e.preventDefault()}
          >
            Drop file here or <Link as="span" color="black" flexDirection="column"
            justifyContent="center"
            alignItems="center">
            <Input
              textColor="white"
              type="file"
              onChange={(e) => {
                this.props.handleUpload(e);
                this.props.setIsFileChosen(true);
              }}
              opacity={0}
              width="auto"
              position="relative"
              zIndex={2}
              focusBorderColor='black'
            /> select
            </Link> from a folder
          </Box></>
      )
    );
  }
}
