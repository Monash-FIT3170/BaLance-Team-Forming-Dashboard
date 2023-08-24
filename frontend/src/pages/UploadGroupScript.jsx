import React, { useState } from 'react';
import {
  Box,
  Text,
  Flex,
  IconButton,
  Button,
  Center,
  Alert,
  AlertIcon,
} from '@chakra-ui/react';
import { ArrowForwardIcon, ArrowBackIcon } from '@chakra-ui/icons';
import { useParams } from 'react-router-dom';
import PyInfoButton from '../components/PyInfoButton'; // Import your PyInfoButton component
import UploadPy from '../components/UploadPy'; // Import your UploadPy component
import { useNavigate } from 'react-router-dom'; // Import the useNavigate hook

function UploadGroupScript() {
  const [pyFile, setPyFile] = useState(null);
  const { unitCode, year, period } = useParams();
  const navigate = useNavigate();

  const handleUpload = (e) => {
    e.preventDefault();
    const uploadedFile = e.target.files[0];
    setPyFile(uploadedFile);
  };

  const handleSubmit = () => {
    // Handle the file submission here, e.g., send it to the server
    if (pyFile) {
      // Make an API call or perform other actions with the uploaded file
      console.log('File uploaded:', pyFile);
    } else {
      console.log('No file uploaded.');
    }
  };

  const navigateToOfferingDashboard = () => {
    navigate(`/createGroups/${unitCode}/${year}/${period}`);
  };

  return (
    <Box padding="4">
      <Button onClick={navigateToOfferingDashboard}>
        <ArrowBackIcon />
        Return to Create Groups Page
      </Button>
      <Center>
        <Box width="80%">
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
          <PyInfoButton
            infoHeader=".py file format"
            infoText="Accepted .py files should contain the necessary script for custom group formation."
          />
          <UploadPy
            pyFile={pyFile}
            handleUpload={handleUpload}
          />
          {pyFile && (
            <Button
              mt={4}
              colorScheme="green"
              leftIcon={<ArrowForwardIcon />}
              onClick={handleSubmit}
            >
              Upload Script
            </Button>
          )}
        </Box>
      </Center>
    </Box>
  );
}

export default UploadGroupScript;





