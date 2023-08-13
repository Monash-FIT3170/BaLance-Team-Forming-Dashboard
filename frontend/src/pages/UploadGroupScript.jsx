import React, { useState } from 'react';
import { Box, Text, Flex, IconButton, Input } from '@chakra-ui/react';
import { ArrowForwardIcon } from '@chakra-ui/icons';
import { useParams } from 'react-router';
import { Link, useNavigate } from 'react-router-dom';

function UploadGroupScript() {
  const [file, setFile] = useState(null);
  const navigate = useNavigate();

  const handleUpload = (e) => {
    e.preventDefault();
    const uploadedFile = e.target.files[0];
    setFile(uploadedFile);
  };

  const {
    unitCode,
    year,
    period
  } = useParams();

  const handleSubmit = async () => {
    if (file) {
      try {
        const formData = new FormData();
        formData.append('pythonFile', file);

        const response = await fetch(`http://localhost:8080/api/groups/:${unitCode}/:${year}/:${period}/uploadScript`, {
          method: 'POST',
          body: formData,
        });

        if (response.ok) {
          const data = await response.json(); // Wait for JSON parsing
          console.log(data);
          navigate(`/assigningPage`, {state: {data}});
        } else {
          throw new Error('Request failed with status ' + response.status);
        }
      } catch (error) {
        console.error(error);
      }
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
          <Input type="file" accept=".py" onChange={handleUpload} />
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
