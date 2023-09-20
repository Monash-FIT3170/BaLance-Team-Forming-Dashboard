import React, { useState } from 'react';
import { useParams } from 'react-router';
import { DeleteProfile } from '../components/importPage/DeleteProfile';
import { ConfirmClearSelection } from '../components/importPage/ConfirmClearSelection';
import { UploadCSV } from '../components/importPage/UploadCSV';
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

const ImportPage = () => {
    let authService = {
        "DEV": MockAuth,
        "TEST": useAuth0
    }
    const { getAccessTokenSilently } = authService[process.env.REACT_APP_AUTH]();

    // State hooks for this page
    const [isFileChosen, setIsFileChosen] = useState(false);
    const [csvFile, setCsvFile] = useState(null);
    const [isConfirmationClearOpen, setIsConfirmationClearOpen] = useState(false); // todo what is this?
    const [currProfile, setCurrProfile] = useState(null);
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


    const handleFileUpload = (e) => {
        /**
         * Handles file upload when clicking the upload CSV button
         */
        e.preventDefault();
        e.stopPropagation();
        const file = e.target.files[0];
        if (file) {
            handleFile(file);
        }
    };

    // Logic for processing a file upload
    const handleFile = (file) => {
        /**
         * Processes a CSV file and converts it to an array of student profiles
         * containing the relevant data
         *
         */

        if (!file.type.match('csv.*')) {
            getToast("Please select a CSV file!", "error")
            return;
        }

        const reader = new FileReader();
        reader.readAsText(file);

        reader.onload = (event) => {
            // obtain CSV contents as string and convert to dict
            const csvString = event.target.result;
            const csvDict = csvToDict(csvString);
            console.log(csvDict)

            const profilesWithDefaultValues = csvDict.map((profile) => {
                if (data === 'effort') {
                    return {
                        ...profile,
                        enrolmentStatus: 'ACTIVE',
                        discPersonality: 'DOMINANT',
                        marksPerHour: profile.averageMark / profile.hours
                    }
                }
            });

            setCsvFile(file);
            setProfiles(profilesWithDefaultValues);
        };

        // Convert CSV string to dictionary
        function csvToDict(csvStr) {
            // From http://techslides.com/convert-csv-to-json-in-javascript
            const lines = csvStr.split('\r\n');
            const csvHeaders = lines[0].split(',');
            const csvData = lines.slice(1);

            const result = csvData.map((line) => {
                const obj = {}
                const data = line.split(',')
                csvHeaders.forEach((header, index) => {
                    if(header in headerMapping) {
                        obj[headerMapping[header]] = data[index]
                    }
                })
                return obj
            })
            return result;
        }
    };

    // TODO REFACTOR HANDLER FUNCTIONS BELOW
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
        setCurrProfile(null);
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
        setCurrProfile(null);

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


    // TODO FINISH REFACTORING RENDER
    return (
        <div>
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
                            handleUpload={handleFileUpload}
                            setIsFileChosen={setIsFileChosen}
                        />
                        <Box bg='#E6EBF0' p={4} alignContent="center" width="80%">
                            <Center>
                                No new students added.
                            </Center>
                        </Box>
                    </div>
                ) : (
                    <div>
                        <ButtonGroup>
                            <Button mb={2} colorScheme="red" onClick={handleClearSelection}>
                                Clear
                            </Button>
                            <Button onClick={handleAddProfilesClick}>
                                Add To Offering
                            </Button>
                        </ButtonGroup>
                        {/*FIXME*/}
                        <CsvPreviewTable
                            headers={headers}
                            profiles={profiles}
                        />
                    </div>
                )}

                <ConfirmClearSelection
                    isConfirmationClearOpen={isConfirmationClearOpen}
                    handleConfirmClearSelection={handleConfirmClearSelection}
                    handleCloseConfirmation={handleCloseConfirmation}
                />
                {/* FIXME */}
                {/*<EditStudentModal/>*/}
                {/* FIXME */}
                {/*<AddStudentModal/>*/}

                {/* BUTTON FOR ADDING A STUDENT */}
                <Button
                    width="50%"
                    onClick={onAddProfileOpen}
                    colorScheme="gray"
                    margin-left="20">
                    <HStack>
                        <AddIcon />
                        <Spacer />
                        <Text>Add Student</Text>
                    </HStack>
                </Button>
            </VStack>
        </div>
    );
}

export default ImportPage;
