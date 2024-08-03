import { FiUploadCloud } from 'react-icons/fi';
import { useAuth0 } from '@auth0/auth0-react';
import { useParams } from 'react-router';
import {
    Box,
    Text,
    Button,
    Input,
    HStack,
    ButtonGroup,
    VStack,
    Link,
    useToast,
    Flex,
} from '@chakra-ui/react';

import { MockAuth } from '../../helpers/mockAuth';
import getToastSettings from '../_shared/ToastSettings';

function csvToArr(stringValue) {
    // Add logic
    const [keys, ...rest] = stringValue
        .trim()
        .split(/\r?\n/)
        .map((item) => item.split(','));

    const formedArr = rest.map((item) => {
        const object = {};
        keys.forEach((key, index) => (object[key] = item.at(index)));
        return object;
    });

    return formedArr;
}

const UploadCSV = ({
    isFileChosen,
    setIsFileChosen,
    setIsConfirmationClearOpen,
    width,
    csvHeaderType,
    headerMap,
    profiles,
    setCsvFile,
    setProfiles,
}) => {
    let authService = {
        DEV: MockAuth,
        TEST: useAuth0,
    };
    const { getAccessTokenSilently } = authService[import.meta.env.VITE_REACT_APP_AUTH]();
    const { unitCode, year, period } = useParams();
    const toast = useToast();
    const getToast = (title, status) => {
        toast.closeAll();
        toast(getToastSettings(title, status));
    };

    const handleDrop = (e) => {
        /**
         * handler for dragging and dropping a file into input box area
         */
        e.preventDefault();
        e.stopPropagation();
        const file = e.dataTransfer.files[0];
        if (file) {
            handleFile(file);
            setIsFileChosen(true);
        }
    };

    const handleClearSelection = () => {
        setIsConfirmationClearOpen(true);
    };

    //create unit for new students
    const handleAddProfilesClick = async () => {
        const accessToken = await getAccessTokenSilently();
        // Make API call
        // const apiCall = csvHeaderType === 'students' ? csvHeaderType : 'students/personality';
        const apiCall =
            {
                // headerType: apiCall endpoint
                students: 'students',
                times: 'students/times',
            }[csvHeaderType] ?? 'students/personality';

        const profilesObject = {
            students: profiles,
            testType: csvHeaderType,
        };
        const body = csvHeaderType === 'students' ? profiles : profilesObject;

        console.log(body);

        try {
            //data parameter is the type of data, eg students,effort,personality
            const response = await fetch(
                `/api/${apiCall}/${unitCode}/${year}/${period}`,
                {
                    method: 'POST',
                    headers: new Headers({
                        Authorization: `Bearer ${accessToken}`,
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                    }),
                    body: JSON.stringify(body),
                }
            );
            if (!response.ok) {
                console.log(response);
                getToast('There was an error importing your file!', 'error');
                throw new Error('Error sending data to the REST API');
            } else {
                getToast('Your file has been imported successfully!', 'success');
                setCsvFile(null); // Reset the file selection
                setProfiles([]); // Clear the table data
                setIsFileChosen(false); // Reset the file chosen state
            }
        } catch (error) {
            console.error('Error sending data to the REST API:', error);
        }
    };

    const handleFile = (file) => {
        /**
         * Processes a CSV file and converts it to an array of student profiles
         * containing the relevant data
         */
        if (!file.type.match('csv.*')) {
            getToast('Please select a CSV file!', 'error');
            return;
        }

        const reader = new FileReader();
        reader.readAsText(file);
        reader.onload = (event) => {
            // obtain raw data from CSV file
            const csvLines = event.target.result.split(/\r?\n/);
            const csvHeaders = csvLines[0].split(',');

            // check if all the headerMap is a subset of csvHeaders
            if (!Object.keys(headerMap).every((header) => csvHeaders.includes(header))) {
                getToast(
                    'The inputted .csv file does not match the required headers for your selected data type. Check the ? for more information.',
                    'error'
                );
                setIsFileChosen(false);
                return;
            }
            const csvDataAsObjects = csvToArr(event.target.result);

            setCsvFile(file);
            setProfiles(csvDataAsObjects);
        };
    };

    const handleFileUpload = (e) => {
        e.preventDefault();
        e.stopPropagation();
        const file = e.target.files[0];
        if (file) {
            try {
                handleFile(file);
            } catch (e) {
                console.log(e);
            }
        }
    };

    // HTML
    const fileChosenDisplay = () => {
        return (
            <ButtonGroup>
                <Button mb={2} colorScheme="red" onClick={handleClearSelection}>
                    Clear
                </Button>
                <Button onClick={handleAddProfilesClick}>Save data</Button>
            </ButtonGroup>
        );
    };

    const fileNotChosenDisplay = () => {
        return (
            <Flex width={width} flexWrap="wrap">
                <HStack>
                    <FiUploadCloud />
                    <Text>
                        Submit a .csv file below in accordance with the data type selected
                        in the dropdown
                    </Text>
                </HStack>
                <VStack
                    bg={isFileChosen ? '#00ADB5' : 'white'}
                    borderRadius="md"
                    width="100%"
                    fontWeight="bold"
                    display="flex"
                    flexDirection="column"
                    justifyContent="center" // Center the content horizontally
                    alignItems="center" // Center the content vertically
                    border="2px dashed #24265D"
                    color="black"
                    onDrop={(e) => {
                        handleDrop(e);
                    }}
                    onDragOver={(e) => e.preventDefault()}
                >
                    <Box
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        position="relative"
                        _hover={{ bg: '#E2E8F0', cursor: 'pointer' }}
                        height="100%"
                        width="100%"
                        transition="color 0.3s ease"
                        cursor="pointer"
                        padding="10px"
                    >
                        <Text as="span">Drop file here or</Text>
                        <Box as="div" padding="1ch">
                            <Input
                                type="file"
                                onChange={(e) => {
                                    handleFileUpload(e);
                                    setIsFileChosen(true);
                                }}
                                opacity={0}
                                position="absolute"
                                inset="0"
                                cursor="pointer"
                            />
                            <Link
                                color="blue.500"
                                px={2}
                                py={1}
                                borderRadius="md"
                                borderWidth="1px"
                                borderColor="blue.500"
                                cursor="pointer"
                                style={{ textDecoration: 'none' }}
                            >
                                select
                            </Link>
                        </Box>

                        <Text as="span">from a folder</Text>
                    </Box>
                </VStack>
            </Flex>
        );
    };

    return isFileChosen ? fileChosenDisplay() : fileNotChosenDisplay();
};

export default UploadCSV;
