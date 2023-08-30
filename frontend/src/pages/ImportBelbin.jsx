import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useParams } from 'react-router';
import { DeleteProfile } from '../components/DeleteProfile';
import { ConfirmClearSelection } from '../components/ConfirmClearSelection';
import { UploadCSV } from '../components/UploadCSV';
import { FormField } from '../components/FormField';
import { CsvInfoButton } from '../components/CsvInfoButton';
import { useAuth0 } from '@auth0/auth0-react';

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
  Thead,
  Th,
  HStack,
  Center,
  Spacer,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
  PopoverCloseButton,
  PopoverHeader,
  PopoverBody,
  VStack,
} from '@chakra-ui/react';
import { AddIcon, QuestionOutlineIcon, EditIcon, DeleteIcon } from '@chakra-ui/icons';
import { MockAuth } from '../mockAuth/mockAuth';

function ImportPage() {
  let authService = {
    "DEV": MockAuth,
    "TEST": useAuth0
  }

  const { getAccessTokenSilently } = authService[process.env.REACT_APP_AUTH]();

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

  // Formatted headers for different possible variables
  const headers = [
    ['studentId', 'Student ID'],
    ['studentFirstName', 'First Name'],
    ['studentLastName', 'Last Name'],
    ['labId', 'Lab ID'],
    ['enrolmentStatus', 'Enrolment Status'],
    ['belbinType', 'Belbin Type']
  ];

  // Mapping for CSV headers to database headers
  const headerMapping = {
    SHORT_CODE: 'labId',
    STUDENT_CODE: 'studentId',
    LAST_NAME: 'studentLastName',
    PREFERRED_NAME: 'studentFirstName',
    EMAIL_ADDRESS: 'studentEmailAddress',
    WAM_VAL: 'wamAverage',
    GENDER: 'gender',
    BELBIN_TYPE: 'belbinType',
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
    isOpen: isAddProfileOpen,
    onOpen: onAddProfileOpen,
    onClose: onAddProfileClose,
  } = useDisclosure();

  const {
    isOpen: isEditProfileOpen,
    onOpen: onEditProfileOpen,
    onClose: onEditProfileClose,
  } = useDisclosure();

  const { unitCode, year, period } = useParams();

  //create unit for new students
  const handleAddProfilesClick = async () => {
    // Make API call
    getAccessTokenSilently().then((token) => {
    fetch(`http://localhost:8080/api/students/${unitCode}/${year}/${period}`, {
      method: 'POST',
      headers: new Headers({
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }),
      body: JSON.stringify(profiles),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Error sending data to the REST API');
        }
      })
      .catch((error) => {
        console.error('Error sending data to the REST API:', error);
        // Handle the error from the API if needed
      });
    });

    // After successful creation
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

      const profilesWithDefaultValues = csvDict.map((profile) => {
        return {
          ...profile,
          enrolmentStatus: 'ACTIVE',
          discPersonality: 'DOMINANT',
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

  const handleAttributeChange = (key, value) => {
    setCurrProfile({
      ...currProfile,
      [key]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setProfiles([...profiles, currProfile]);
    setCurrProfile(blankStudent);
    onAddProfileClose();
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

  const handleSaveProfile = (updatedProfile) => {
    // Find the index of the profile in the profiles array
    const index = profiles.findIndex(
      (profile) => profile.studentEmailAddress === currProfile.studentEmailAddress
    );

    // Update the profile object with the new values
    const updatedProfiles = [...profiles];
    updatedProfiles[index] = { ...updatedProfile };

    // Update the profiles state with the updated profile object
    setProfiles(updatedProfiles);
    setCurrProfile(blankStudent);

    // Close the edit modal
    onEditProfileClose();
  };

  // Profile Editing functions
  const handleDeleteProfile = (studentEmailAddress) => {
    const selectedProfile = profiles.find(
      (profile) => profile.studentEmailAddress === studentEmailAddress
    );
    setProfileToDelete(selectedProfile);
    onDeleteProfileOpen();
  };

  const handleDeleteInactiveProfiles = (profiles) => {
    const newProfiles = profiles.filter(
      (profile) => profile.enrolmentStatus.toLowerCase() !== 'active'
    );
    setProfileToDelete(newProfiles);
    onDeleteProfileOpen();
  };

  const handleConfirmDelete = () => {
    if (profileToDelete !== null) {
      const newProfiles = profiles.filter(
        (profile) => profile.studentEmailAddress !== profileToDelete.studentEmailAddress
      );
      setProfiles(newProfiles);
      setProfileToDelete(null);
      onDeleteProfileClose();
    }
  };

  const handleCancelDelete = () => {
    setProfileToDelete(null);
    onDeleteProfileClose();
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
    setShowAlert(false);
  };

  const handleCloseConfirmation = () => {
    setIsConfirmationClearOpen(false);
  };

  return (
    <>
      <Box as="header" p="4" textAlign="center">
        <Text fontSize="2xl" fontWeight="bold">
          Add Student Belbin Types to: {`${unitCode} - ${period} ${year}, **CAMPUS**`}
        </Text>
      </Box>

      {profileToDelete != null && (
        <DeleteProfile
          isModalOpen={isDeleteProfileOpen}
          student={profileToDelete}
          handleCancelDelete={handleCancelDelete}
          handleConfirmDelete={handleConfirmDelete}
        />
      )}

      <VStack>
        <HStack>

          <Flex
            height="100%"
            flexDirection="column"
            alignItems="center"
            textAlign="center"
            maxWidth="50vw"
            minWidth="50vw"
            marginX="3vw"
          >
            {sortedProfiles.length === 0 && (<CsvInfoButton
              infoHeader=".csv file format"
              infoText="Accepted .csv files will have the following attributes: DISPLAY_SUBJECT_CODE SUBJECT_CODE ACTIVITY_GROUP_CODE SHORT_CODE STUDENT_CODE LAST_NAME PREFERRED_NAME EMAIL_ADDRESS WAM_DISPLAY WAM_VAL GENDER"
            />)}

            <UploadCSV
              isFileChosen={isFileChosen}
              csvFile={csvFile}
              handleClearSelection={handleClearSelection}
              handleAddProfilesClick={handleAddProfilesClick}
              handleUpload={handleUpload}
              setIsFileChosen={setIsFileChosen}
            />

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
                  Profiles Added Successfully
                </AlertTitle>
              </Alert>
            )}

            <ConfirmClearSelection
              isConfirmationClearOpen={isConfirmationClearOpen}
              handleConfirmClearSelection={handleConfirmClearSelection}
              handleCloseConfirmation={handleCloseConfirmation}
            />


            <Modal isOpen={isEditProfileOpen} onClose={onEditProfileClose}>
              <ModalOverlay />
              <ModalContent>
                <ModalHeader>Edit Profile</ModalHeader>
                <ModalBody>
                  <FormField
                    label="Student ID"
                    value={currProfile?.studentId}
                    onChange={(e) => handleAttributeChange('studentId', e.target.value)}
                  />
                  <FormField
                    label="First Name"
                    value={currProfile?.studentFirstName}
                    onChange={(e) =>
                      handleAttributeChange('studentFirstName', e.target.value)
                    }
                  />
                  <FormField
                    label="Last Name"
                    value={currProfile?.studentLastName}
                    onChange={(e) =>
                      handleAttributeChange('studentLastName', e.target.value)
                    }
                  />
                  <FormField
                    label="Email Address"
                    placeholder="Email Address"
                    value={currProfile?.studentEmailAddress}
                    onChange={(e) =>
                      handleAttributeChange('studentEmailAddress', e.target.value)
                    }
                  />
                  <FormField
                    label="Lab ID"
                    placeholder="Lab ID"
                    value={currProfile?.labId}
                    onChange={(e) => handleAttributeChange('labId', e.target.value)}
                  />
                  <FormField
                    label="Enrolment Status"
                    placeholder="Select Enrolment Status"
                    value={currProfile?.enrolmentStatus}
                    onChange={(e) =>
                      handleAttributeChange('enrolmentStatus', e.target.value)
                    }
                    options={[
                      { label: 'Active', value: 'ACTIVE' },
                      { label: 'Inactive', value: 'INACTIVE' },
                    ]}
                  />
                  <FormField
                    label="Belbin Type"
                    placeholder="Select Belbin Type"
                    value={currProfile?.discPersonality}
                    onChange={(e) =>
                      handleAttributeChange('discPersonality', e.target.value) //TODO: update when belbin db is created
                    }
                    options={[
                      { label: 'Thinking', value: 'DOMINANT' },
                      { label: 'People', value: 'INFLUENCE' },
                      { label: 'Action', value: 'STEADINESS' },
                    ]}
                  />
                </ModalBody>
                <ModalFooter>
                  <Button
                    onClick={() => handleSaveProfile(currProfile)}
                    type="submit"
                    colorScheme="green"
                    mr={3}
                  >
                    Save
                  </Button>
                  <Button
                    onClick={() => {
                      onEditProfileClose();
                    }}
                  >
                    Cancel
                  </Button>
                </ModalFooter>
              </ModalContent>
            </Modal>
            {/*<Box textAlign="center">
            <IconButton
              mt={4}
              mb={4}
              colorScheme="green"
              icon={<AddIcon />}
              onClick={onAddProfileOpen}
            ></IconButton>

            <Button
              marginLeft="2em"
              colorScheme="red"
              onClick={() => handleDeleteInactiveProfiles(profiles)}
            >
              Delete All Inactive Profiles
            </Button>
            <Button ml={4} colorScheme="blue" onClick={() => handleAddProfilesClick()}>
              Add Profiles To Unit
            </Button>
            
          </Box>
          */}

          </Flex>

          <Center height="20vh">
            <Divider orientation="vertical" />
          </Center>
          <Text paddingX="3vw">When you are finished, click <Text _hover={{ cursor: "pointer" }} color="blue"><a onClick={() => { navigate(`/students/${unitCode}/${year}/${period}`) }}>here</a></Text> to view the unit offering</Text>


        </HStack>

        {sortedProfiles.length === 0 ? (<Box bg='#E6EBF0' p={4} alignContent="center" width="80%">
          <Center>
            No students have yet been added to the offering.
          </Center>
        </Box>) : (<Table variant="striped" size="sm" maxWidth="90vw">
          <Thead>
            <Tr>
              {headers.map((header) => (
                <Th key={header[0]} onClick={() => handleSort(header)}>
                  {header[1]}
                  {sortConfig.key === header[0] && (
                    <span>{sortConfig.direction === 'ascending' ? '▲' : '▼'}</span>
                  )}
                </Th>
              ))}
            </Tr>
          </Thead>
          <Tbody>
            {sortedProfiles.map((profile) => (
              <Tr key={profile.studentEmailAddress}>
                <Td>{profile.studentId}</Td>
                <Td>{profile.studentFirstName}</Td>
                <Td>{profile.studentLastName}</Td>
                <Td>{profile.labId}</Td>
                <Td>{profile.enrolmentStatus}</Td>
                <Td>{profile.belbinType}</Td>

                <Td>
                  <EditIcon
                    style={{ cursor: 'pointer' }}
                    onClick={() => {
                      setCurrProfile(profile);
                      onEditProfileOpen();
                    }}
                  />
                </Td>
                <Td>
                  <DeleteIcon
                    style={{ cursor: 'pointer', color: 'red' }}
                    onClick={() => handleDeleteProfile(profile.studentEmailAddress)} // Call a function to delete the profile when the icon is clicked
                  />
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>)}
      </VStack>




      <Modal isOpen={isAddProfileOpen} onClose={onAddProfileClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add Profile</ModalHeader>
          <ModalBody>
            <Divider my={4} />
            <Box as="form" onSubmit={handleSubmit} onCancel={onAddProfileClose}>
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
                label="Email"
                placeholder="Enter email"
                value={currProfile.studentEmailAddress}
                onChange={(e) =>
                  setCurrProfile({ ...currProfile, studentEmailAddress: e.target.value })
                }
              />
              <FormField
                label="Lab ID"
                placeholder="Enter Lab ID"
                value={currProfile.labId}
                onChange={(e) =>
                  setCurrProfile({ ...currProfile, labId: e.target.value })
                }
              />
            </Box>
          </ModalBody>
          <ModalFooter>
            <Button type="submit" colorScheme="blue" mr={3} onClick={handleSubmit}>
              Save
            </Button>
            <Button onClick={onAddProfileClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default ImportPage;
