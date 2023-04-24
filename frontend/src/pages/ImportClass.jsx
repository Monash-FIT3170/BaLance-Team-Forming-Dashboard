import React, { useState } from "react";
import logo from "../assets/logo.png";
import { Box, Heading, Text, Flex, Input, Alert, AlertIcon, AlertTitle, AlertDescription } from "@chakra-ui/react";
import NavBar from "../components/NavBar";


function ImportPage() {
  const [csvFile, setCsvFile] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  const handleFile = (file) => {
    if (!file.type.match("csv.*")) {
      setErrorMessage("Please select a CSV file");
      return;
    }

    const reader = new FileReader();
    reader.readAsText(file);
    reader.onload = (event) => {
      const csvString = event.target.result;
      setCsvFile(file);
      setErrorMessage("");
      console.log(csvString);
    };
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleUpload = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.target.files[0];
    if (file) {
      handleFile(file);
    }
  };

  return (
    <> 
    <NavBar/>   
    <Flex
      height="100%"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      onDragOver={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
      onDrop={handleDrop}
    >
      {errorMessage && (
        <Alert status="error" my={4}>
          <AlertIcon />
          <Box flex="1">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{errorMessage}</AlertDescription>
          </Box>
        </Alert>
      )}
      {csvFile ? (
        <Box>
          <Text>Selected CSV file: {csvFile.name}</Text>
        </Box>
      ) : (
        <Box>
          <Text>Drag and drop a CSV file here, or click to select a file</Text>
          <Input type="file" onChange={handleUpload} />
        </Box>
      )}
    </Flex>
    </>
  );
}

export default ImportPage;
