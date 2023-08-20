import React, { useState } from 'react';
import {
  Box,
  Text,
  Flex,
  IconButton,
  Input,
  Button,
  Center,
  Alert,
  AlertIcon,
  HStack,
  Spacer,
} from '@chakra-ui/react';
import { ArrowForwardIcon, ArrowBackIcon } from '@chakra-ui/icons';
import { Link, useParams, useNavigate } from 'react-router-dom'; // Import the useParams hook

function UploadGroupScript() {
  const [file, setFile] = useState(null);
  const { unitCode, year, period } = useParams();
  const navigate = useNavigate(); // Hook to handle navigation

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

  const navigateToGroupCreationDashboard = () => {
    // Define the navigation logic to the offering dashboard here
    navigate(`/createGroups/${unitCode}/${year}/${period}`);
  };

  return (
    <Box minHeight="100vh" padding="4">
      <Box width="80%" margin="0 auto">
        <Center>
          <Button onClick={navigateToGroupCreationDashboard}>
            <HStack>
              <ArrowBackIcon />
              <Spacer />
              <Text>Return to Group Creation Page</Text>
            </HStack>
          </Button>
        </Center>
        <Text fontSize="2xl" fontWeight="bold" textAlign="center" mb={4}>
          Upload Group Script to: {`${unitCode} - ${period} ${year}, **CAMPUS**`}
        </Text>
        <Alert status="info" borderRadius="md">
          <AlertIcon />
          <Text>
            Please upload a Python script (.py) that will be used for custom group formation.
            Make sure the script adheres to the requirements.
          </Text>
        </Alert>
        <Flex direction="column" alignItems="center" mt={4}>
          <Input type="file" accept=".py" onChange={handleUpload} />
          {file && (
            <Button
              mt={4}
              colorScheme="green"
              leftIcon={<ArrowForwardIcon />}
              onClick={handleSubmit}
            >
              Upload Script
            </Button>
          )}
        </Flex>
      </Box>
    </Box>
  );
}

export default UploadGroupScript;


