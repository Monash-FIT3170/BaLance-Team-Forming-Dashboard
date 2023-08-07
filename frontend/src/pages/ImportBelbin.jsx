import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router';
import { DeleteProfile } from '../components/DeleteProfile';
import { ConfirmClearSelection } from '../components/ConfirmClearSelection';
import { UploadCSV } from '../components/UploadCSV';
import { FormField } from '../components/FormField';

import {
  Box,
  Text,
  Flex,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Button,
  Table,
  Tbody,
  Tr,
  Td,
  TableContainer,
  Divider,
  Select,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  useDisclosure,
  IconButton,
} from '@chakra-ui/react';
import { AddIcon, EditIcon, DeleteIcon } from '@chakra-ui/icons';

function BelbinImporter() {
  class Student {
    constructor(
      studentId,
      studentFirstName,
      studentLastName,
      studentEmailAddress,
      wamAverage,
      gender,
      labId,
      enrolmentStatus,
      discPersonality
    ) {
      this.studentId = studentId;
      this.studentFirstName = studentFirstName;
      this.studentLastName = studentLastName;
      this.studentEmailAddress = studentEmailAddress;
      this.wamAverage = wamAverage;
      this.gender = gender;
      this.labId = labId;
      this.enrolmentStatus = enrolmentStatus;
      this.discPersonality = discPersonality;
    }
  }

  const blankStudent = new Student('', '', '', '', '', '', '', '', '');

  // Defaults for assigning groups
  const defaultGroupSize = 4;
  const defaultVariance = 1;
  const defaultStrategy = 'random';

  // Formatted headers for different possible variables
  const headers = [
    ['studentId', 'Student ID'],
    ['studentFirstName', 'First Name'],
    ['studentLastName', 'Last Name'],
    ['belbinType', 'Belbin Type']
  ];

  // Mapping for CSV headers to database headers
  const headerMapping = {
    SHORT_CODE: 'labId',
    STUDENT_CODE: 'studentId',
    LAST_NAME: 'studentLastName',
    PREFERRED_NAME: 'studentFirstName',
    BELBIN_TYPE: 'belbinType'
  };

  // State hooks for this page
  const [isFileChosen, setIsFileChosen] = useState(false);
  const [csvFile, setCsvFile] = useState(null);
  const [isConfirmationClearOpen, setIsConfirmationClearOpen] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [currProfile, setCurrProfile] = useState(blankStudent);

  // Define state for the current sort order and column
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
  const [profileToDelete, setProfileToDelete] = useState(null);
  const [profiles, setProfiles] = useState([]);
  const navigate = useNavigate();

  // UseDisclosure variables for modals
  const {
    isOpen: isDeleteProfileOpen,
    onOpen: onDeleteProfileOpen,
    onClose: onDeleteProfileClose,
  } = useDisclosure();

  const {
    isOpen: isAddBelbinOpen,
    onOpen: onAddBelbinOpen,
    onClose: onAddBelbinClose,
  } = useDisclosure();

  const {
    isOpen: isEditProfileOpen,
    onOpen: onEditProfileOpen,
    onClose: onEditProfileClose,
  } = useDisclosure();

  const { unitCode, year, period } = useParams();

  const handleAssignGroupsClick = async () => {
    
  };

  //create belbin type for students manually
  const handleAddBelbinClick = async () => {
    // to implement api call to belbin db
    setShowAlert(true);
  };

  // Logic for table sorting by column
  const handleSort = (header) => {
    const key = header[0];
    if (sortConfig.key === key) {
      setSortConfig({
        ...sortConfig,
        direction: sortConfig.direction === 'ascending' ? 'descending' : 'ascending',
      });
    } else {
      setSortConfig({ key, direction: 'ascending' });
    }
  };

  // Logic for processing a file upload
  const handleFile = (file) => {
    if (!file.type.match('csv.*')) {
      console.error('Please select a CSV file');
      return;
    }

    const reader = new FileReader();
    reader.readAsText(file);

    reader.onload = (event) => {
      const csvString = event.target.result;
      const csvDict = csvToDict(csvString);
      setCsvFile(file);

      // Add default values to enrollmentStatus and discPersonality
      // TODO: expect this info from CSV file
      const profilesWithDefaultValues = csvDict.map((profile) => {
        return {
          ...profile
        };
      });

      setProfiles(profilesWithDefaultValues);
      
    };

    // Convert CSV string to dictionary
    function csvToDict(csvStr) {
      // From http://techslides.com/convert-csv-to-json-in-javascript
      var lines = csvStr.split('\r\n');

      var result = [];

      var csvHeaders = lines[0].split(',');

      // Populate dictionary item
      for (var i = 1; i < lines.length; i++) {
        var obj = {};
        var currentline = lines[i].split(',');

        for (var j = 0; j < csvHeaders.length; j++) {
          if (csvHeaders[j] in headerMapping) {
            obj[headerMapping[csvHeaders[j]]] = currentline[j];
          }
        }
        result.push(obj);
      }
      return result;
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

  const handleSubmit = (e) => {
    e.preventDefault();
    setProfiles([...profiles, currProfile]);
    setCurrProfile(blankStudent);
    onAddBelbinClose();
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
      <Box as="header" p="4" textAlign="center">
        <Text fontSize="2xl" fontWeight="bold">
          Upload Belbin Types
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
        <UploadCSV
          isFileChosen={isFileChosen}
          csvFile={csvFile}
          handleClearSelection={handleClearSelection}
          handleUpload={handleUpload}
          setIsFileChosen={setIsFileChosen}
        />
        <ConfirmClearSelection
          isConfirmationClearOpen={isConfirmationClearOpen}
          handleConfirmClearSelection={handleConfirmClearSelection}
          handleCloseConfirmation={handleCloseConfirmation}
        />
        <Box width="80%" borderWidth="1px" borderRadius="lg" overflow="hidden" mt={8}>
          <Box borderWidth="2px" borderColor="black" as="header" p="4">
            <Text fontSize="2xl" fontWeight="bold">
              Students' Belbin Types
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
                    <Td>{profile.belbinType}</Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>

            <Box textAlign="center">
            <IconButton
                mt={4}
                mb={4}
                colorScheme="green"
                icon={<AddIcon />}
                onClick={onAddBelbinOpen}
              ></IconButton>

        <Modal isOpen={isAddBelbinOpen} onClose={onAddBelbinClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add Student Belbin Type</ModalHeader>
          <ModalBody>
            <Divider my={4} />
            <Box as="form" onSubmit={handleSubmit} onCancel={onAddBelbinClose}>
              <FormField
                label="Student ID"
                placeholder="Enter Student ID"
                value={currProfile.studentId}
                onChange={(e) =>
                  setCurrProfile({ ...currProfile, studentId: e.target.value })
                }
              />
              <FormField
                label="First Name"
                placeholder="Enter first name"
                value={currProfile.studentFirstName}
                onChange={(e) =>
                  setCurrProfile({ ...currProfile, studentFirstName: e.target.value })
                }
              />
              <FormField
                label="Last Name"
                placeholder="Enter last name"
                value={currProfile.studentLastName}
                onChange={(e) =>
                  setCurrProfile({ ...currProfile, studentLastName: e.target.value })
                }
              />
              <FormField
                label="Belbin Type"
                placeholder="Select Belbin Type"
                value={currProfile.discPersonality}
                onChange={(e) =>
                  setCurrProfile({ ...currProfile, discPersonality: e.target.value })
                }
                options={[
                  { label: 'Thought', value: 'DOMINANT' },
                  { label: 'Action', value: 'INFLUENCE' },
                  { label: 'People', value: 'STEADINESS' },
                ]}
              />
            </Box>
          </ModalBody>
          <ModalFooter>
            <Button type="submit" colorScheme="blue" mr={3} onClick={handleSubmit}>
              Save
            </Button>
            <Button onClick={onAddBelbinClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

              <Button 
                ml={4} 
                mt={4}
                mb={4} 
                colorScheme="blue" onClick={() => handleAddBelbinClick()}>
                Add Student's Belbin Type to Unit
              </Button>
              {showAlert && (
                <Alert
                  status="success"
                  variant="subtle"
                  flexDirection="column"
                  alignItems="center"
                  justifyContent="center"
                  textAlign="center"
                  height="200px"
                >
                  <AlertIcon boxSize="40px" mr={0} />
                  <AlertTitle mt={4} mb={1} fontSize="lg">
                    Belbin Types Added Successfully
                  </AlertTitle>
                  <AlertDescription maxWidth="sm">
                    You Are Now Able To Use The Belbin Grouping Stratergy!
                  </AlertDescription>
                </Alert>
              )}
            </Box>
          </TableContainer>
        </Box>
        <Box mt={8} display="flex" justifyContent="space-between" alignItems="center">
          <Button onClick={handleAssignGroupsClick} w="100%" colorScheme="blue">
            Next
          </Button>
        </Box>
      </Flex>
    </>
  );
}

export default BelbinImporter;
