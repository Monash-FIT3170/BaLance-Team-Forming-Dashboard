import React, { useState } from 'react';
import { useParams } from 'react-router';
import { DeleteProfileModal } from '../components/importPage/DeleteProfileModal';
import ConfirmClearSelection from '../components/importPage/ConfirmClearSelection';
import UploadCSV from '../components/importPage/UploadCSV';
import getToastSettings from '../components/ToastSettings';
import { useAuth0 } from '@auth0/auth0-react';
import {
    Flex,
    useDisclosure,
    Spacer,
    VStack,
    useToast,
} from '@chakra-ui/react';
import { MockAuth } from '../mockAuth/mockAuth';
import CsvPreviewTable from "../components/importPage/CsvPreviewTable";
import BackToUnitButton from "../components/shared/BackToUnitButton";
import PageHeader from "../components/shared/PageHeader";
import AddButton from "../components/shared/AddButton";
import DropdownDynamic from "../components/shared/DropdownDynamic";
import AddStudentModal from "../components/importPage/AddStudentModal";

const ImportPage = () => {
    let authService = {
        "DEV": MockAuth,
        "TEST": useAuth0
    }
    const { getAccessTokenSilently } = authService[process.env.REACT_APP_AUTH]();

    // State hooks for this page
    const [isFileChosen, setIsFileChosen] = useState(false);
    const [csvFile, setCsvFile] = useState(null);
    const [isClearModalOpen, setIsClearModalOpen] = useState(false); // todo what is this?
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
        headers.push(
            ['studentEmailAddress', 'Email Address'],
            ['wamAverage', 'WAM'],
            ['gender', 'Gender'],
            ['labId', 'Lab ID'],
            ['enrolmentStatus', 'Enrolment Status']
        )
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
            // obtain raw data from CSV file
            const csvLines = event.target.result.split('\r\n');
            const csvHeaders = csvLines[0].split(',');
            const csvData = csvLines.slice(1);

            // obtained from http://techslides.com/convert-csv-to-json-in-javascript
            // convert CSV content from string to array of objects
            const csvDict = csvData.map((line) => {
                const obj = {}
                const data = line.split(',')
                csvHeaders.forEach((header, index) => {
                    if(header in headerMapping) {
                        obj[headerMapping[header]] = data[index]
                    }
                })
                return obj
            })

            const profilesWithDefaultValues = csvDict.map((profile) => {
                if (data === 'effort') {
                    return {
                        ...profile,
                        marksPerHour: profile.averageMark / profile.hours
                    }
                }
                return profile
            });

            setCsvFile(file);
            setProfiles(profilesWithDefaultValues);
        };
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

    // DELETE MODAL STUFF TODO
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

    return (
        <VStack>
            <PageHeader
                fontSize={"2xl"}
                pageDesc={`Import student data: ${unitCode} ${period} ${year}`}
            />
            <BackToUnitButton/>

            <Flex width="80%">
                <UploadCSV
                    infoButtonHeader={".csv file format"}
                    infoButtonText={"include the following headers: BRUH, BRUH BRU"}
                    isFileChosen={isFileChosen}
                    csvFile={csvFile}
                    handleAddProfilesClick={handleAddProfilesClick}
                    handleUpload={handleFileUpload}
                    setIsConfirmationClearOpen={setIsClearModalOpen}
                    setIsFileChosen={setIsFileChosen}
                    width="60%"
                />
                <Spacer/>
                <Flex width="33%" flexDirection="column" justifyContent="flex-end">
                    <DropdownDynamic
                        placeholder={'select data type'}
                        options={['students', 'belbin', 'effort']}
                        width="100%"
                    />
                </Flex>
            </Flex>

            <AddButton
                onClick={onAddProfileOpen}
                buttonText={"Add an entry"}
                width="80%"
            />
            <CsvPreviewTable
                headers={headers}
                profiles={profiles}
            />

            <ConfirmClearSelection
                setCsvFile={setCsvFile}
                setIsFileChosen={setIsFileChosen}
                setProfiles={setProfiles}
                isClearModalOpen={isClearModalOpen}
                setIsClearModalOpen={setIsClearModalOpen}
            />

            {/*<EditStudentModal/>*/}
            {/*{profileToDelete != null && (*/}
            {/*    <DeleteProfileModal*/}
            {/*        isModalOpen={isDeleteProfileOpen}*/}
            {/*        student={profileToDelete}*/}
            {/*        handleCancelDelete={handleCancelDelete}*/}
            {/*        handleConfirmDelete={handleConfirmDelete}*/}
            {/*    />*/}
            {/*)}*/}
            {/* FIXME AddStudentModal is broken */}
        </VStack>
    );
}

export default ImportPage;
