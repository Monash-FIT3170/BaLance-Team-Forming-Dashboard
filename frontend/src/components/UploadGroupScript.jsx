import React, { useState } from 'react';
import { Box, Text, Flex, IconButton, Input } from '@chakra-ui/react';
import { ArrowForwardIcon } from '@chakra-ui/icons';

function UploadGroupScript() {
  const [file, setFile] = useState(null);

  const handleUpload = (e) => {
    e.preventDefault();
    const uploadedFile = e.target.files[0];
    setFile(uploadedFile);
  };

  const handleSubmit = () => {
    // Handle the file submission here, e.g., send it to the server
    if (file) {
      // Make an API call or perform other actions with the uploaded file
      console.log('File uploaded:', file);
    } else {
      console.log('No file uploaded.');
    }
  };

  return (
    <>
      <Box as="header" p="4" textAlign="center">
        <Text fontSize="2xl" fontWeight="bold">
          Upload Group Formation Script
        </Text>
      </Box>

      <Flex
        height="100%"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        textAlign="center"
        margin="20px"
      >
        <Box>
          <Input type="file" accept=".js" onChange={handleUpload} />
          {file && (
            <IconButton
              mt={4}
              colorScheme="green"
              icon={<ArrowForwardIcon />}
              onClick={handleSubmit}
            />
          )}
        </Box>
      </Flex>
    </>
  );
}

export default UploadGroupScript;
