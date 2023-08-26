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
  const [scriptContent, setScriptContent] = useState('');
  const [pyFile, setPyFile] = useState(null);
  const { unitCode, year, period } = useParams();
  const navigate = useNavigate();

  const handleUpload = (e) => {
    e.preventDefault();
    const uploadedFile = e.target.files[0];
    setPyFile(uploadedFile);
  
    // Read the content of the file
    const reader = new FileReader();
    reader.onload = (event) => {
      setScriptContent(event.target.result);
    };
    reader.readAsText(uploadedFile);
  };

  const handleSubmit = async() => {
    // Handle the file submission here, e.g., send it to the server
    if (pyFile) {
      const formData = new FormData();
      formData.append('pythonFile', pyFile);  // Changed to 'pythonFile' here

      try {
        const response = await fetch(`http://localhost:8080/api/groups/${unitCode}/${year}/${period}/uploadScript`, {
          method: 'POST',
          body: formData,
          // Note: fetch, by default, detects the form data and sets the correct content type
        });

        if (response.ok) {
          console.log('File uploaded successfully.');
          // Optionally navigate the user to another page or show a success message.
        } else {
          console.error('Error uploading the script:', await response.text());
          // Optionally show an error message to the user.
        }

      } catch (error) {
        console.error('Error uploading the script:', error);
        // Optionally show an error message to the user.
      }
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
          <Center>
            <Alert status="info" borderRadius="md">
              <AlertIcon />
              <Text>
                Please upload a Python script (.py) that will be used for custom group formation.
                Make sure the script adheres to the requirements.
              </Text>
            </Alert>
          </Center>
          <PyInfoButton
            infoHeader=".py file format"
            infoText="Accepted .py files should contain the necessary script for custom group formation."
          />
          <Center>
            <UploadPy
              pyFile={pyFile}
              handleUpload={handleUpload}
            />
          </Center>
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
      {scriptContent && (
        <>
            <h3>Script Preview:</h3>
            <pre>{scriptContent}</pre>
        </>
      )}
    </Box>
  );
}

export default UploadGroupScript;





