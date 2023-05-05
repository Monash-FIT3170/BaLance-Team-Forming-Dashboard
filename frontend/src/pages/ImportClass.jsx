import React, { useState } from "react";
import logo from "../assets/logo.png";
import { Box, Heading, Text, Flex, Input, Alert, AlertIcon, AlertTitle, AlertDescription, Table, Thead, Tbody, Tr, TableContainer, } from "@chakra-ui/react";
import NavBar from "../components/NavBar";

function ImportPage() {

  const [csvData, setCsvData] = useState("");
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
      const csvDict = csvToDict(csvString);
      setCsvFile(file);
      setErrorMessage("");
      setCsvData(csvDict);
      console.log(csvDict)
      
    };

    function csvToDict(csvStr) {
      // From http://techslides.com/convert-csv-to-json-in-javascript
      var lines=csvStr.split("\r\n");

      var result = [];

      var headers=lines[0].split(",");

      for(var i=1;i<lines.length;i++){

        var obj = {};
        var currentline=lines[i].split(",");

        for(var j=0;j<headers.length;j++){
          obj[headers[j]] = currentline[j];
        }

        result.push(obj);
      }

      return result;
      }
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
        <Flex
        flexDirection="column"
        alignItems="center">
          <Box>
            <Text>Selected CSV file: {csvFile.name}</Text>
            <Heading> Imported Data </Heading>
          </Box>
          <TableContainer maxWidth="80%" display="flex">
            <Table variant='striped' colorScheme='teal' size ='lg'>
              <Thead>
                <Tr text-align="center" >
                  {
                  Object.keys(csvData[0]).map(heading => {
                    return <th key={heading}>{heading}</th>
                  })}
                </Tr>
              </Thead>
              <Tbody>
              {csvData.map((row, index) => {
                return <tr key={index}>
                  {Object.keys(csvData[0]).map((key, index) => {
                    return <td key={row[key]}>{row[key]}</td>
                    })}
                    </tr>;
                  })}
              </Tbody>
            </Table>
          </TableContainer>
        </Flex>
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
