import * as React from 'react';
import { Box, Text, Button, Input, HStack, ButtonGroup, VStack, Link } from '@chakra-ui/react';
import { FiUploadCloud } from 'react-icons/fi';
import { CsvInfoButton } from './CsvInfoButton';

const UploadCSV = ({
  infoButtonHeader,
  infoButtonText,
  handleUpload,
  handleClearSelection,
  handleAddProfilesClick,
  isFileChosen,
  setIsFileChosen,
  handleDrop
}) => {
  return isFileChosen === true ? (
    <ButtonGroup>
      <Button mb={2} colorScheme="red" onClick={handleClearSelection}>
        Clear
      </Button>
      <Button onClick={handleAddProfilesClick}>Save data</Button>
    </ButtonGroup>
  ) : (
    <VStack>
      <CsvInfoButton infoHeader={infoButtonHeader} infoText={infoButtonText} />
      <HStack>
        <FiUploadCloud />
        <Text>Submit a .csv file below to add student data to the offering</Text>
      </HStack>
      <Box
        bg={isFileChosen ? '#00ADB5' : 'white'}
        borderRadius="md"
        width="70%"
        height="300px"
        margin="0 3vw 5vw 3vw"
        fontWeight="bold"
        display="flex"
        flexDirection="row"
        justifyContent="center" // Center the content horizontally
        alignItems="center" // Center the content vertically
        border="2px dashed #24265D"
        color="black"
        transition="color 0.3s ease"
        onDrop={(e) => {
          handleDrop(e);
        }}
        onDragOver={(e) => e.preventDefault()}
      >
        <Box display="inline-flex" alignItems="center">
          <Text as="span">Drop file here or</Text>
          <Box as="span" position="relative" display="inline-block" _hover={{ backgroundColor: "blue.100" }} cursor="pointer">
            <Input
              type="file"
              onChange={(e) => {
                handleUpload(e);
                setIsFileChosen(true);
              }}
              opacity={0}
              position="absolute"
              width="100%"
              height="100%"
              top="0"
              left="0"
              cursor="pointer"
              zIndex="2"
            />
            <Link 
            color="blue.500" 
            zIndex="1" 
            display="inline-block" 
            padding="10" 
            px={2}
            py={1}
            borderRadius="md"
            borderWidth="1px"
            borderColor="blue.500"
            cursor="pointer"
            >
                select
            </Link>
          </Box>

          <Text as="span">from a folder</Text>
        </Box>
      </Box>
    </VStack>
  );
};

export default UploadCSV;
