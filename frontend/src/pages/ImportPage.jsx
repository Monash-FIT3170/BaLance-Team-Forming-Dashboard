import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useParams } from 'react-router';
import { DeleteProfile } from '../components/importPage/DeleteProfile';
import { ConfirmClearSelection } from '../components/importPage/ConfirmClearSelection';
import { UploadCSV } from '../components/importPage/UploadCSV';
import { FormField } from '../components/importPage/FormField';
import { CsvInfoButton } from '../components/importPage/CsvInfoButton';
import getToastSettings from '../components/ToastSettings';
import { useAuth0 } from '@auth0/auth0-react';
import {AddIcon} from '@chakra-ui/icons';
import {
    Box,
    ButtonGroup,
    Text,
    Flex,
    Button,
    Divider,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    useDisclosure,
    HStack,
    Center,
    Spacer,
    VStack,
    useToast
} from '@chakra-ui/react';
import { MockAuth } from '../mockAuth/mockAuth';
import CsvPreviewTable from "../components/importPage/CsvPreviewTable";
import BackToUnitButton from "../components/BackToUnitButton";
import PageHeader from "../components/PageHeader";

function ImportPage() {
    let authService = {
        "DEV": MockAuth,
        "TEST": useAuth0
    }

    const { getAccessTokenSilently } = authService[process.env.REACT_APP_AUTH]();

    // todo where is this used and can we use dictionaries instead
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

    // State hooks for this page
    const [isFileChosen, setIsFileChosen] = useState(false);
    const [csvFile, setCsvFile] = useState(null);
    const [isConfirmationClearOpen, setIsConfirmationClearOpen] = useState(false); // todo what is this?
    const [currProfile, setCurrProfile] = useState(blankStudent);

    // Define state for the current sort order and column
    const [profileToDelete, setProfileToDelete] = useState(null);
    const [profiles, setProfiles] = useState([]);

    // useDisclosure variables for modals
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

    const {
        data,
        unitCode,
        year,
        period
    } = useParams();

    // Formatted headers for different possible variables todo can this be removed?
    const headers = [
        ['studentId', 'Student ID'],
        ['studentFirstName', 'First Name'],
        ['studentLastName', 'Last Name']
    ];

    // Mapping for CSV headers to database headers todo can this be removed
    const headerMapping = {
        SHORT_CODE: 'labId',
        STUDENT_CODE: 'studentId',
        LAST_NAME: 'studentLastName',
        PREFERRED_NAME: 'studentFirstName',
    };

    // todo strategy method??
    if (data === 'students') {
        headers.push(['studentEmailAddress', 'Email Address'],
            ['wamAverage', 'WAM'],
            ['gender', 'Gender'],
            ['labId', 'Lab ID'],
            ['enrolmentStatus', 'Enrolment Status'])
        headerMapping['EMAIL_ADDRESS'] = 'studentEmailAddress'
        headerMapping['WAM_VAL'] = 'wamAverage'
        headerMapping['GENDER'] = 'gender'

    } else if (data === 'effort') {
        headers.push(['labId', 'Lab ID'],
            ['enrolmentStatus', 'Enrolment Status'],
            ['hours', 'Hours'],
            ['averageMark', 'Average Mark'],
            ['marksPerHour', 'Marks per Hour'])
        headerMapping['HOURS'] = 'hours'
        headerMapping['AVERAGE_MARK'] = 'averageMark'

    } else if (data === 'personality') {
        headers.push(['labId', 'Lab ID'],
            ['enrolmentStatus', 'Enrolment Status'],
            ['belbinType', 'Belbin Type'])
        headerMapping['EMAIL_ADDRESS'] = 'studentEmailAddress'
        headerMapping['WAM_VAL'] = 'wamAverage'
        headerMapping['GENDER'] = 'gender'
        headerMapping['BELBIN_TYPE'] = 'belbinType'
    }

    const toast = useToast();
    const getToast = (title, status) => {
        toast.closeAll();
        toast(getToastSettings(title, status))
    }

    //create unit for new students
    const handleAddProfilesClick = async () => {
        // todo, could use a dropdown and its value instead
        let apiCall = ""
        if (data === 'effort') {
            apiCall = 'personality'
        } else {
            apiCall = data
        }
        getAccessTokenSilently().then((token) => {
            // Make API call 
            //data parameter is the type of data, eg students,effort,personality
            fetch(`http://localhost:8080/api/${apiCall}/${unitCode}/${year}/${period}`, {
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
                        console.log(response)
                        // if the import is not successful
                        getToast("There was an error importing your file!", "error")
                        throw new Error('Error sending data to the REST API');
                    }
                    else {
                        // if the import is successful
                        getToast("Your file has been imported successfully!", "success")
                    }
                })
                .catch((error) => {
                    console.error('Error sending data to the REST API:', error);
                    // Handle the error from the API if needed
                });

        });
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
                if (data === 'students') {
                    return {
                        ...profile,
                        enrolmentStatus: 'ACTIVE',
                        discPersonality: 'DOMINANT',
                    }
                }
                else if (data === 'effort') {
                    return {
                        ...profile,
                        enrolmentStatus: 'ACTIVE',
                        discPersonality: 'DOMINANT',
                        marksPerHour: profile.averageMark / profile.hours
                    }
                }
                else if (data === 'personality') {
                    return {
                        ...profile,
                        enrolmentStatus: 'ACTIVE',
                        discPersonality: 'DOMINANT',
                    }
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
        if (currProfile.enrolmentStatus === "") {
            currProfile.enrolmentStatus = 'ACTIVE'
        }
        if (currProfile.belbinType === "") {
            currProfile.belbinType = 'ACTION';
        }
        if (currProfile.averageMark !== "" && currProfile.hours !== "") {
            currProfile['marksPerHour'] = currProfile.averageMark / currProfile.hours
        }
        setProfiles([...profiles, currProfile]);
        setCurrProfile(blankStudent);
        onAddProfileClose();
    };

    const handleSaveProfile = (updatedProfile) => {
        // Find the index of the profile in the profiles array
        const index = profiles.findIndex(
            (profile) => profile.studentEmailAddress === currProfile.studentEmailAddress
        );
        if (updatedProfile.averageMark !== "" && updatedProfile.hours !== "") {
            updatedProfile['marksPerHour'] = updatedProfile.averageMark / updatedProfile.hours
        }
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
    const handleDeleteProfile = (studentId) => {
        const selectedProfile = profiles.find(
            (profile) => profile.studentId === studentId
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
                (profile) => profile.studentId !== profileToDelete.studentId
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
            <PageHeader
                fontSize={"2xl"}
                pageDesc={`Import student data: ${unitCode} ${period} ${year}`}
            />

            <BackToUnitButton/>

            {profileToDelete != null && (
                <DeleteProfile
                    isModalOpen={isDeleteProfileOpen}
                    student={profileToDelete}
                    handleCancelDelete={handleCancelDelete}
                    handleConfirmDelete={handleConfirmDelete}
                />
            )}

            <VStack>
                {/* ADD CSV BUTTON AND THE (?) */}
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

                        {profiles.length === 0 ? (
                            <div>
                                <CsvInfoButton
                                    infoHeader=".csv file format"
                                    infoText="Accepted .csv files will have the following attributes: DISPLAY_SUBJECT_CODE SUBJECT_CODE ACTIVITY_GROUP_CODE SHORT_CODE STUDENT_CODE LAST_NAME PREFERRED_NAME EMAIL_ADDRESS WAM_DISPLAY WAM_VAL GENDER"
                                />
                                <UploadCSV
                                    isFileChosen={isFileChosen}
                                    csvFile={csvFile}
                                    handleClearSelection={handleClearSelection}
                                    handleAddProfilesClick={handleAddProfilesClick}
                                    handleUpload={handleUpload}
                                    setIsFileChosen={setIsFileChosen}
                                />
                            </div>
                        ) : (
                            <ButtonGroup>
                                <Button mb={2} colorScheme="red" onClick={handleClearSelection}>
                                    Clear
                                </Button>
                                <Button onClick={handleAddProfilesClick}>
                                    Add To Offering
                                </Button>
                            </ButtonGroup>)
                        }
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
                                        label="Belbin Type"
                                        placeholder="Select Personality Type"
                                        value={currProfile?.belbinType}
                                        onChange={(e) =>
                                            handleAttributeChange('belbinType', e.target.value)
                                        }
                                        options={[
                                            { label: 'Action', value: 'action' },
                                            { label: 'People', value: 'people' },
                                            { label: 'Thinking', value: 'thinking' }
                                        ]}
                                    />
                                    <FormField
                                        label="Hours"
                                        placeholder="Hours"
                                        value={currProfile?.hours}
                                        onChange={(e) => handleAttributeChange('hours', e.target.value)}
                                    />
                                    <FormField
                                        label="Average Marks"
                                        placeholder="Average Mark"
                                        value={currProfile?.averageMark}
                                        onChange={(e) => handleAttributeChange('averageMark', e.target.value)}
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
                    </Flex>
                </HStack>

                {/* ADD INDIVIDUAL STUDENTS BUTTON */}
                <Button
                    width="80%"
                    onClick={onAddProfileOpen}
                    colorScheme="gray"
                    margin-left="20">
                    <HStack>
                        <AddIcon />
                        <Spacer />
                        <Text>Add Student</Text>
                    </HStack>
                </Button>

                {/* DISPLAY LIST OF STUDENTS IF PROFILES IS NOT EMPTY */}
                {profiles.length === 0 ? (
                    <Box bg='#E6EBF0' p={4} alignContent="center" width="80%">
                        <Center>
                            No new students added.
                        </Center>
                    </Box>
                ) : (
                    // REFACTOR TO COMPONENT fixme
                    <CsvPreviewTable
                        headers={headers}
                        profiles={profiles}
                    />
                )}
            </VStack>

            <Modal isOpen={isAddProfileOpen} onClose={onAddProfileClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Add Profile</ModalHeader>
                    <ModalBody>
                        <Divider my={4} />
                        <Box as="form" onSubmit={handleSubmit} onCancel={onAddProfileClose}>
                            <FormField
                                label="Student ID*"
                                placeholder="Enter Student ID"
                                value={currProfile.studentId}
                                onChange={(e) =>
                                    setCurrProfile({ ...currProfile, studentId: e.target.value })
                                }
                            />
                            <FormField
                                label="First Name*"
                                placeholder="Enter first name"
                                value={currProfile.studentFirstName}
                                onChange={(e) =>
                                    setCurrProfile({ ...currProfile, studentFirstName: e.target.value })
                                }
                            />
                            <FormField
                                label="Last Name*"
                                placeholder="Enter last name"
                                value={currProfile.studentLastName}
                                onChange={(e) =>
                                    setCurrProfile({ ...currProfile, studentLastName: e.target.value })
                                }
                            />
                            <FormField
                                label="Email*"
                                placeholder="Enter email"
                                value={currProfile.studentEmailAddress}
                                onChange={(e) =>
                                    setCurrProfile({ ...currProfile, studentEmailAddress: e.target.value })
                                }
                            />
                            <FormField
                                label="WAM*"
                                placeholder="Enter WAM"
                                value={currProfile.wamAverage}
                                onChange={(e) =>
                                    setCurrProfile({ ...currProfile, wamAverage: e.target.value })
                                }
                            />
                            <FormField
                                label="Gender*"
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
                                label="Lab ID*"
                                placeholder="Enter Lab ID"
                                value={currProfile.labId}
                                onChange={(e) =>
                                    setCurrProfile({ ...currProfile, labId: e.target.value })
                                }
                            />
                            <FormField
                                label="Enrolment Status*"
                                placeholder="Enter Enrolment Status"
                                value={currProfile.enrolmentStatusd}
                                onChange={(e) =>
                                    setCurrProfile({ ...currProfile, enrolmentStatus: e.target.value })
                                }
                                options={[
                                    { label: 'Active', value: 'ACTIVE' },
                                    { label: 'Inactive', value: 'INACTIVE' },
                                ]}
                            />
                            <FormField
                                label="Belbin Type"
                                placeholder="Select Belbin Type"
                                value={currProfile.belbinType}
                                onChange={(e) =>
                                    setCurrProfile({ ...currProfile, belbinType: e.target.value })
                                }
                                options={[
                                    { label: 'Thinking', value: 'Thinking' },
                                    { label: 'People', value: 'People' },
                                    { label: 'Action', value: 'Action' },
                                ]}
                            />
                            <FormField
                                label="Hours of Contribution"
                                placeholder="Enter hours"
                                value={currProfile.hours}
                                onChange={(e) =>
                                    setCurrProfile({ ...currProfile, hours: e.target.value })
                                }
                            />
                            <FormField
                                label="Average Mark"
                                placeholder="Enter Average Mark"
                                value={currProfile.averageMark}
                                onChange={(e) =>
                                    setCurrProfile({ ...currProfile, averageMark: e.target.value })
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
