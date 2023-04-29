import React, { useState } from "react";
import logo from "../assets/logo.png";
import { 
  Box,
  Text,
  Flex,
  Input,
  Alert,
  AlertIcon,
  AlertTitle,
  ChakraProvider,
  extendTheme,
  AlertDescription,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer
} from "@chakra-ui/react";
import NavBar from "../components/NavBar";

const customTheme = extendTheme({
  fonts: {
    heading: "Montserrat, sans-serif",
    body: "Montserrat, sans-serif",
  },
  fontWeights: {
    normal: 400,
    medium: 600,
    bold: 700,
  },
})

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

  // Dummy data for the table
  const profiles = [
    {
      firstName: "John",
      lastName: "Doe",
      emailAddress: "john.doe@example.com",
      wam: "HD",
      status: "Active",
      role: "Teacher"
    },
    {
      firstName: "Jane",
      lastName: "Duncan",
      emailAddress: "jane.duncan@example.com",
      wam: "D",
      status: "Active",
      role: "Student"
    },
    {
      firstName: "Tom",
      lastName: "Marshall",
      emailAddress: "tom.marshall@example.com",
      wam: "D",
      status: "Active",
      role: "Student"
    },
    {
      firstName: "Jessica",
      lastName: "Stoltman",
      emailAddress: "jessica.stoltman@example.com",
      wam: "P",
      status: "Active",
      role: "Student"
    },
  ];

  return (
    <>
      <NavBar />
      <Box as="header" p="4">
        <Text fontSize="2xl" fontWeight="bold">
          Upload Profiles
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
        <Box
          width="50%"
          height="175px"
          border="2px dashed black"
          borderRadius="md"
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          textAlign="center"
        >
          <Text
            fontFamily="Montserrat, sans-serif"
            fontWeight="bold"
            fontSize="2xl"
            mb={4}
          >
            Drag and Drop CSV file here
          </Text>
          <Box
            bg="white"
            borderRadius="md"
            width="80%"
            p={4}
            mb={4}
            fontWeight="bold"
          >
            {csvFile ? (
              <Text>No file chosen: {csvFile.name}</Text>
            ) : (
              <>
                <Text mb={2}>No file chosen</Text>
                <Button variant="solid" colorScheme="teal">
                  Choose File
                  <input
                    type="file"
                    onChange={handleUpload}
                    style={{ display: "none" }}
                  />
                </Button>
              </>
            )}
          </Box>
          {errorMessage && (
            <Alert status="error" mb={4}>
              <AlertIcon />
              <Box flex="1">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{errorMessage}</AlertDescription>
              </Box>
            </Alert>
          )}
        </Box>
        <Box
          width="80%"
          borderWidth="1px"
          borderRadius="lg"
          overflow="hidden"
          mt={8}
        >
        <Box borderWidth="2px" borderColor="black" as="header" p="4">
        <Text fontSize="2xl" fontWeight="bold">
          View Profiles
        </Text>
        </Box>
          <TableContainer borderWidth="2px" borderColor="black">
            <Table variant="striped">
              <Thead>
                <Tr>
                  <Th>First Name</Th>
                  <Th>Last Name</Th>
                  <Th>Email Address</Th>
                  <Th>WAM</Th>
                  <Th>Status</Th>
                  <Th>Role</Th>
                </Tr>
              </Thead>
              <Tbody>
                {profiles.map((profile, index) => (
                  <Tr key={index}>
                    <Td>{profile.firstName}</Td>
                    <Td>{profile.lastName}</Td>
                    <Td>{profile.emailAddress}</Td>
                    <Td>{profile.wam}</Td>
                    <Td>{profile.status}</Td>
                    <Td>{profile.role}</Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
        </Box>
      </Flex>
    </>
  );
  

}

export default ImportPage;
