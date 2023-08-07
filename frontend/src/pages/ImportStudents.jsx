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

function ImportPage() {
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
    ['studentEmailAddress', 'Email Address'],
    ['wamAverage', 'WAM'],
    ['gender', 'Gender'],
    ['labId', 'Lab ID'],
    ['enrolmentStatus', 'Enrolment Status'],
    ['discPersonality', 'DISC Personality'],
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

  const handleAssignGroupsClick = async () => {
    // Get current values
    const groupStrategy =
      document.getElementById('groupStrategy').value || defaultStrategy;
    const groupSize = document.getElementById('groupSize').value || defaultGroupSize;
    const variance = document.getElementById('variance').value || defaultVariance;

    // Make API call
    await fetch(`http://localhost:8080/api/groups/${unitCode}/${year}/${period}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        groupSize: Number(groupSize),
        variance: Number(variance),
        strategy: groupStrategy
      })
    });
    // Go to groups page todo
    navigate(`/groups/${unitCode}/${year}/${period}`);
  };

  //create unit for new students
  const handleAddProfilesClick = async () => {
    // Make API call
    fetch(`http://localhost:8080/api/students/${unitCode}/${year}/${period}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
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

      // Add default values to enrollmentStatus and discPersonality
      // TODO: expect this info from CSV file
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
  };

  const handleCloseConfirmation = () => {
    setIsConfirmationClearOpen(false);
  };

  return (
    <>
      <Box as="header" p="4" textAlign="center">
        <Text fontSize="2xl" fontWeight="bold">
          Upload Profiles
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
                    <Td>{profile.enrolmentStatus}</Td>
                    <Td>{profile.discPersonality}</Td>

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
            </Table>
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
                    label="WAM"
                    placeholder="WAM"
                    value={currProfile?.wamAverage}
                    onChange={(e) => handleAttributeChange('wamAverage', e.target.value)}
                  />
                  <FormField
                    label="Gender"
                    placeholder="Select Gender"
                    value={currProfile?.gender}
                    onChange={(e) => handleAttributeChange('gender', e.target.value)}
                    options={[
                      { label: 'M', value: 'M' },
                      { label: 'F', value: 'F' },
                    ]}
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
                    label="DISC Personality"
                    placeholder="Select Personality Type"
                    value={currProfile?.discPersonality}
                    onChange={(e) =>
                      handleAttributeChange('discPersonality', e.target.value)
                    }
                    options={[
                      { label: 'Dominant', value: 'DOMINANT' },
                      { label: 'Influence', value: 'INFLUENCE' },
                      { label: 'Steadiness', value: 'STEADINESS' },
                      { label: 'Conscientiousness', value: 'CONSCIENTIOUSNESS' },
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

            <Box textAlign="center">
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
                  <AlertDescription maxWidth="sm">
                    You can now assign groups using the menu below!
                  </AlertDescription>
                </Alert>
              )}
            </Box>
          </TableContainer>
        </Box>
        <Box mt={8} display="flex" justifyContent="space-between" alignItems="center">
          <Select placeholder="Select strategy" w="40%" mr={4} id="groupStrategy">
            <option value="random">Random</option>
            <option value="effort">Effort</option>
            <option value="belbin">Belbin</option>
          </Select>
          <Select placeholder="No. per team" w="40%" mr={4} id="groupSize">
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
          </Select>
          <Select placeholder="Team variance" w="40%" mr={4} id="variance">
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
          </Select>
          <Button onClick={handleAssignGroupsClick} w="25%" colorScheme="blue">
            Assign groups
          </Button>
        </Box>
      </Flex>

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
                label="WAM"
                placeholder="Enter WAM"
                value={currProfile.wamAverage}
                onChange={(e) =>
                  setCurrProfile({ ...currProfile, wamAverage: e.target.value })
                }
              />
              <FormField
                label="Gender"
                placeholder="Select gender"
                value={currProfile.gender}
                onChange={(e) =>
                  setCurrProfile({ ...currProfile, gender: e.target.value })
                }
                options={[
                  { label: 'M', value: 'M' },
                  { label: 'F', value: 'F' },
                ]}
              />
              <FormField
                label="Lab ID"
                placeholder="Enter Lab ID"
                value={currProfile.labId}
                onChange={(e) =>
                  setCurrProfile({ ...currProfile, labId: e.target.value })
                }
              />
              <FormField
                label="Enrolment Status"
                placeholder="Select Enrolment Status"
                value={currProfile.enrolmentStatus}
                onChange={(e) =>
                  setCurrProfile({ ...currProfile, enrolmentStatus: e.target.value })
                }
                options={[
                  { label: 'Active', value: 'ACTIVE' },
                  { label: 'Inactive', value: 'INACTIVE' },
                ]}
              />
              <FormField
                label="DISC Personality"
                placeholder="Select Personality Type"
                value={currProfile.discPersonality}
                onChange={(e) =>
                  setCurrProfile({ ...currProfile, discPersonality: e.target.value })
                }
                options={[
                  { label: 'Dominant', value: 'DOMINANT' },
                  { label: 'Influence', value: 'INFLUENCE' },
                  { label: 'Steadiness', value: 'STEADINESS' },
                  { label: 'Conscientiousness', value: 'CONSCIENTIOUSNESS' },
                ]}
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
