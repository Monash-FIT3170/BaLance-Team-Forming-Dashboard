import React, { useState } from "react";
import logo from "../assets/logo.png";
import { useNavigate } from "react-router-dom";
import { FiUploadCloud } from "react-icons/fi";

import { 
  Box,
  Text,
  Flex,
  Input,
  Alert,
  AlertIcon,
  AlertTitle,
  extendTheme,
  AlertDescription,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Divider,
  CloseButton,
  Select,
  FormControl,
  FormLabel,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Icon,
  InputGroup,
  IconButton
} from "@chakra-ui/react";
import {
  AddIcon,
  CloseIcon,
  EditIcon,
  DeleteIcon
} from "@chakra-ui/icons";
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

  const [isFileChosen, setIsFileChosen] = useState(false);
  const [csvData, setCsvData] = useState("");
  const [csvFile, setCsvFile] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [showAddProfileForm, setShowAddProfileForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isConfirmationClearOpen, setIsConfirmationClearOpen] = useState(false);
  
// Define state for the current sort order and column
// Define state for the current sort order and column
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
  const [profileToDelete, setProfileToDelete] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [profiles, setProfiles] = useState([]);

  const navigate = useNavigate();

  const handleAssignGroupsClick = () => {
    navigate('/groups');
  };

  const headers = [
    ['studentId', "Student ID"], ['studentFirstName', 'First Name'], ['studentLastName', "Last Name"], ['studentEmailAddress', "Email Address"], ['wamAverage', "WAM"], ['gender', "Gender"], ['labId', "Lab ID"]];
  
  const headerMapping = {
    'SHORT_CODE' : 'labId',
    'STUDENT_CODE': 'studentId',
    'LAST_NAME' : 'studentLastName',
    'PREFERRED_NAME' : 'studentFirstName',
    'EMAIL_ADDRESS' : 'studentEmailAddress',
    'WAM_VAL' : 'wamAverage',
    'GENDER' : 'gender'
  }

  const handleSort = (header) => {
    const key = header[0];
    if (sortConfig.key === key) {
      setSortConfig({ ...sortConfig, direction: sortConfig.direction === 'ascending' ? 'descending' : 'ascending' });
       console.log("current sortConfig key: ", sortConfig.key);
      console.log("current sortConfig key: ", key, "current direction: ", sortConfig.direction);
    } else {
      setSortConfig({ key, direction: 'ascending' });
    }
  };

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
      setProfiles(csvDict);
    };

    function csvToDict(csvStr) {
      // From http://techslides.com/convert-csv-to-json-in-javascript
      var lines=csvStr.split("\r\n");

      var result = [];

      var csvHeaders=lines[0].split(",");


      // Populate dictionary item
      for(var i=1;i<lines.length;i++){

        var obj = {};
        var currentline=lines[i].split(",");

        for(var j=0;j<csvHeaders.length;j++){

          if (csvHeaders[j] in headerMapping){
            obj[headerMapping[csvHeaders[j]]] = currentline[j];
          }
        
        }
        result.push(obj);
      }

      console.log(result);

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

  const [studentId, setStudentId] = useState("");
  const [studentFirstName, setStudentFirstName] = useState("");
  const [studentLastName, setStudentLastName] = useState("");
  const [studentEmailAddress, setStudentEmailAddress] = useState("");
  const [wamAverage, setWamAverage] = useState("");
  const [gender, setGender] = useState("");
  const [labId, setLabId] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const newProfile = { studentId, studentFirstName, studentLastName, studentEmailAddress, wamAverage, gender, labId };
    setProfiles([...profiles, newProfile]);
    setShowAddProfileForm(false);
    setStudentId("");
    setStudentFirstName("");
    setStudentLastName("");
    setStudentEmailAddress("");
    setWamAverage("");
    setGender("");
    setLabId("");
  };


  const sortedProfiles = [...profiles].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === 'ascending' ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === 'ascending' ? 1 : -1;
    }
    return 0;
  });

  
  const [profileToEdit, setProfileToEdit] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleSaveProfile = (updatedProfile) => {
    console.log(updatedProfile);
  
    if (!profileToEdit) {
      // handle error - profileToEdit is not defined
      return;
    }
  
    // Find the index of the profile in the profiles array
    const index = profiles.findIndex(profile => profile.studentEmailAddress === profileToEdit.studentEmailAddress);
    
    // Update the profile object with the new values
    const updatedProfiles = [...profiles];
    updatedProfiles[index] = {...updatedProfile};
  
    // Update the profiles state with the updated profile object
    setProfiles(updatedProfiles);
    
    // Close the edit modal
    onClose();
  };

// const handleDeleteProfile = (emailAddress) => {
//   const newProfiles = profiles.filter((profile) => profile.emailAddress !== emailAddress);
//   setProfiles(newProfiles);
// };

  // Profile Editing functions
   const handleDeleteProfile = (studentEmailAddress) => {
    const selectedProfile = profiles.find(
      (profile) => profile.studentEmailAddress === studentEmailAddress
    );
    setProfileToDelete(selectedProfile);
    setIsModalOpen(true);
   };
  
  const handleDeleteInactiveProfiles = (profiles) => {
    const newProfiles = profiles.filter((profile) => profile.status.toLowerCase() !== "active");
    setProfileToDelete(newProfiles);
    setIsModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (profileToDelete !== null) {
      const newProfiles = profiles.filter(
        (profile) => profile.studentEmailAddress !== profileToDelete.studentEmailAddress
      );
      setProfiles(newProfiles);
      setProfileToDelete(null);
      setIsModalOpen(false);
    }
  };
  

  const handleCancelDelete = () => {
    setProfileToDelete(null);
    setIsModalOpen(false);
  };

  // Clear CSV file selection
  const handleClearSelection = () => {
    setIsConfirmationClearOpen(true);
  };

  const handleConfirmClearSelection = () => {
    setCsvFile(null); // Reset the file selection
    setProfiles([]); // Clear the table data
    setIsFileChosen(false); // Reset the file chosen state
    setIsConfirmationClearOpen(false); // Close the modal
  };

  const handleCloseConfirmation = () => {
    setIsConfirmationClearOpen(false);
  };

  return (
    <>
      {profileToDelete !== null && (
        <Modal isOpen={isModalOpen} onClose={handleCancelDelete}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Delete Profile</ModalHeader>
            <ModalBody>
              <p>Are you sure you want to delete the following profile?</p> <br />
              <b>Name: </b> <p>{profileToDelete.studentFirstName} {profileToDelete.studentLastName}</p>
              <b>Email Address: </b> <p> {profileToDelete.studentEmailAddress} </p>
              <b>WAM: </b> <p>{profileToDelete.wamAverage}</p>
            </ModalBody>
            <ModalFooter>
              <Button colorScheme="red" mr={3} onClick={handleConfirmDelete}>
                Delete
              </Button>
              <Button onClick={handleCancelDelete}>Cancel</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}

      <Box as="header" p="4" textAlign="center">
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
            bg={isFileChosen ? "#00ADB5" : "white"}
            borderRadius="md"
            width="80%"
            p={4}
            mb={4}
            fontWeight="bold"
            display="flex"
            flexDirection="column"
            justifyContent="center" // Center the content horizontally
            alignItems="center" // Center the content vertically
            border="2px dashed #00ADB5"
            color="#00ADB5"
            transition="color 0.3s ease"
            _hover={{ color: "#fff", bg: "#00ADB5", cursor: "pointer" }}
            _focus={{ outline: "none" }}
            cursor="pointer"
          >
            {csvFile ? (
               <>
               <Text color="white" mb={2}>File: {csvFile.name} </Text>
                <Button mb={2} colorScheme="red" onClick={handleClearSelection}>
                  Clear Selection
                </Button>
              </>
            ) : (
              <Flex  justifyContent="center" mx="auto">
                  <Icon as={FiUploadCloud} boxSize={6} mr={2} />
                  <Text> Upload </Text>
                  <Input
                    textColor="white"
                    type="file"
                    onChange={(e) => {
                      handleUpload(e);
                      setIsFileChosen(true);
                    }}
                    opacity={0}
                    width="100%"
                    height="100%"
                    left={0}
                    top={0}
                    cursor="pointer"
                  />
            </Flex>
            )}
          </Box>
          <Modal isOpen={isConfirmationClearOpen} onClose={handleCloseConfirmation}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Confirm Clear Selection</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                Are you sure you want to clear the selection?
              </ModalBody>
              <ModalFooter>
                <Button colorScheme="red" onClick={handleConfirmClearSelection}>
                  Clear Selection
                </Button>
                <Button variant="ghost" onClick={handleCloseConfirmation}>
                  Cancel
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
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
            <thead>
                  <tr>
                      {headers.map((header) => (
                        <th key={header[0]} onClick={() => handleSort(header)}>
                        {header[1]}
                        {sortConfig.key === header[0] && (
                          <span>{sortConfig.direction === 'ascending' ? '▲' : '▼'}</span>
                        )}
                      </th>
                    ))}
                  </tr>
                </thead>
              <Tbody>
                
  {sortedProfiles.map((profile) => (
    <Tr key={profile.studentEmailAddress}>
      <Td>{profile.studentId}</Td>
      <Td>{profile.studentFirstName}</Td>
      <Td>{profile.studentLastName}</Td>
      <Td>{profile.studentEmailAddress}</Td>
      <Td>{profile.wamAverage}</Td>
      <Td>{profile.gender}</Td>
      <Td>{profile.labId}</Td>

      <Td>
      <EditIcon
        style={{ cursor: "pointer" }}
        onClick={() => {
          setProfileToEdit(profile);
          onOpen();
        }}
      />
    </Td>
    <Td>
      <DeleteIcon
        style={{ cursor: "pointer", color: "red" }}
        onClick={() => handleDeleteProfile(profile.studentEmailAddress)} // Call a function to delete the profile when the icon is clicked
      />
    </Td>
  </Tr>
))} 
              </Tbody>
            </Table>
            <Modal isOpen={isOpen} onClose={onClose}>
              <ModalOverlay />
              <ModalContent>
                <ModalHeader>Edit Profile</ModalHeader>
                <ModalBody>
                <FormControl>
                    <FormLabel>Student ID</FormLabel>
                    <Input
                      value={profileToEdit?.studentId}
                      onChange={(e) =>
                        setProfileToEdit({
                          ...profileToEdit,
                          studentId: e.target.value,
                        })
                      }
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel>First Name</FormLabel>
                    <Input
                      value={profileToEdit?.studentFirstName}
                      onChange={(e) =>
                        setProfileToEdit({
                          ...profileToEdit,
                          studentFirstName: e.target.value,
                        })
                      }
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel>Last Name</FormLabel>
                    <Input
                      value={profileToEdit?.studentLastName}
                      onChange={(e) =>
                        setProfileToEdit({
                          ...profileToEdit,
                          studentLastName: e.target.value,
                        })
                      }
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel>Email Address</FormLabel>
                    <Input
                      type="email"
                      value={profileToEdit?.studentEmailAddress}
                      onChange={(e) =>
                        setProfileToEdit({
                          ...profileToEdit,
                          studentEmailAddress: e.target.value,
                        })
                      }
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel>WAM</FormLabel>
                    <Input
                      placeholder="WAM"
                      value={profileToEdit?.wamAverage}
                      onChange={(e) =>
                        setProfileToEdit({
                          ...profileToEdit,
                          wamAverage: e.target.value,
                        })
                      }
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel>Gender</FormLabel>
                    <Select
                      placeholder="Select Gender"
                      value={profileToEdit?.gender}
                      onChange={(e) =>
                        setProfileToEdit({
                          ...profileToEdit,
                          gender: e.target.value,
                        })
                      }
                    >
                      <option value="M">M</option>
                      <option value="F">F</option>
                    </Select>
                  </FormControl>
                  <FormControl>
                    <FormLabel>Lab ID</FormLabel>
                    <Input
                      placeholder="Lab ID"
                      value={profileToEdit?.labId}
                      onChange={(e) =>
                        setProfileToEdit({
                          ...profileToEdit,
                          labId: e.target.value,
                        })
                      }
                    />
                  </FormControl>
                  </ModalBody>
                  <ModalFooter>
                    <Button onClick={() => handleSaveProfile(profileToEdit)} type="submit" colorScheme="green" mr={3}>
                      Save
                    </Button>
                    <Button onClick={() => { setIsEditing(false); onClose();}}>Cancel</Button>
                  </ModalFooter>
              </ModalContent>
            </Modal>

            <Box textAlign="center">
              <IconButton
                mt={4}
                mb={4}
                colorScheme="green"
                icon={<AddIcon />}
                onClick={() => setShowAddProfileForm(true)}
              >
              </IconButton>

      <Button marginLeft="2em"   colorScheme="red" onClick={() => handleDeleteInactiveProfiles(profiles)}>Delete All Inactive Profiles</Button>
            </Box>
          </TableContainer>
        </Box>
        <Box mt={8} display="flex" justifyContent="space-between" alignItems="center">
              <Select placeholder="Select strategy" w="40%" mr={4}>
                <option value="random">Random</option>
              </Select>
              <Select placeholder="No. per team" w="40%" mr={4}>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
              </Select>
              <Button onClick={handleAssignGroupsClick} colorScheme="blue">Assign groups</Button>
          </Box>
      </Flex>
      {showAddProfileForm && (
        <Box
          position="fixed"
          top="0"
          left="0"
          width="100vw"
          height="100vh"
          bg="rgba(0, 0, 0, 0.6)"
          zIndex="modal"
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          <Box
            bg="white"
            p={6}
            borderRadius="md"
            boxShadow="md"
            width={{ base: "90vw", sm: "50vw", md: "30vw" }}
          >
            <Flex justifyContent="space-between" alignItems="center">
              <Text fontSize="xl" fontWeight="bold">
                Add Profile
              </Text>
              <CloseButton
                aria-label="Close"
                onClick={() => setShowAddProfileForm(false)}
              />
            </Flex>
            <Divider my={4} />
            <Box as="form" onSubmit={handleSubmit} onCancel={() => setShowAddProfileForm(false)}>
            <FormControl mb={4}>
                <FormLabel>Student ID</FormLabel>
                <Input placeholder="Enter Student ID" value={studentId} onChange={e => setStudentId(e.target.value)} />
              </FormControl>
              <FormControl mb={4}>
                <FormLabel>First Name</FormLabel>
                <Input placeholder="Enter first name" value={studentFirstName} onChange={e => setStudentFirstName(e.target.value)} />
              </FormControl>
              <FormControl mb={4}>
                <FormLabel>Last Name</FormLabel>
                <Input placeholder="Enter last name" value={studentLastName} onChange={e => setStudentLastName(e.target.value)} />
              </FormControl>
              <FormControl mb={4}>
                <FormLabel>Email</FormLabel>
                <Input type="email" placeholder="Enter email" value={studentEmailAddress} onChange={e => setStudentEmailAddress(e.target.value)} />
              </FormControl>
              <FormControl mb={4}>
                <FormLabel>WAM</FormLabel>
                <Input placeholder="Enter WAM" value={wamAverage} onChange={e => setWamAverage(e.target.value)} />
              </FormControl>
              <FormControl mb={4}>
                <FormLabel>Gender</FormLabel>
                <Select placeholder="Select gender" value={gender} onChange={e => setGender(e.target.value)} >
                  <option value="M">M</option>
                  <option value="F">F</option>
                </Select>
              </FormControl>
              <FormControl mb={4}>
                <FormLabel>Lab ID</FormLabel>
                <Input placeholder="Enter Lab ID" value={labId} onChange={e => setLabId(e.target.value)} />
              </FormControl>
              <Button type="submit" colorScheme="blue" mr={3}>Save</Button>
              <Button onClick={() => setShowAddProfileForm(false)}>Cancel</Button>
            </Box>
          </Box>
        </Box>
      )}
    </>
  );
  

}

export default ImportPage;
