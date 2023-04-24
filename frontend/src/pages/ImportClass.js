import React, { useState } from "react";
import logo from "../assets/logo.png";
import { Box, Heading, Text, Flex, Input } from "@chakra-ui/react";

function ImportPage() {
  const [csvFile, setCsvFile] = useState(null);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsText(file);
      reader.onload = (event) => {
        const csvString = event.target.result;
        setCsvFile(file);
        console.log(csvString);
      };
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files[0];
    if (file) {
      setCsvFile(file);
    }
  };

  return (
    <Flex
      height="100%"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <Heading as="h1">This page is used to:</Heading>
      {csvFile ? (
        <Box>
          <Text>Selected CSV file: {csvFile.name}</Text>
        </Box>
      ) : (
        <Box>
          <Text>Drag and drop a CSV file here, or click to select a file</Text>
          <Input type="file" onChange={handleFileUpload} />
        </Box>
      )}
    </Flex>
  );
}

export default ImportPage;
