import * as React from 'react';
import {Box, Text, Button, Input, HStack, ButtonGroup, VStack, Link, useToast} from '@chakra-ui/react';
import { FiUploadCloud } from 'react-icons/fi';
import { CsvInfoButton } from './CsvInfoButton';
import getToastSettings from '../shared/ToastSettings';
import {MockAuth} from "../../helpers/mockAuth";
import {useAuth0} from "@auth0/auth0-react";
import {useParams} from "react-router";

const UploadCSV = ({
    isFileChosen,
    setIsFileChosen,
    setIsConfirmationClearOpen,
    width,
    dataType,
    headerMap,
    profiles,
    setCsvFile,
    setProfiles
}) => {
    let authService = {
        "DEV": MockAuth,
        "TEST": useAuth0
    }
    const { getAccessTokenSilently } = authService[process.env.REACT_APP_AUTH]();

    const {
        unitCode,
        year,
        period
    } = useParams();

    const toast = useToast();
    const getToast = (title, status) => {
        toast.closeAll();
        toast(getToastSettings(title, status))
    }

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

    // FIXME need to consider auth stuff too
    //create unit for new students
    const handleAddProfilesClick = async () => {
        // todo, could use a dropdown and its value instead
        let apiCall = ""
        if (dataType === 'effort') {
            apiCall = 'personality'
        } else {
            apiCall = dataType
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

            // obtain the index of headers we care about
            const headerMapKeys = Object.keys(headerMap);
            const headerIndexes = [];
            csvHeaders.forEach((csvHeader, index) => {
                if(headerMapKeys.includes(csvHeader)){
                    headerIndexes.push(index);
                }
            });

            // derived from http://techslides.com/convert-csv-to-json-in-javascript
            // convert csvData into a list of objects
            const csvDataAsObjects = csvData.map((line) => {
                const obj = {}
                const data = line.split(',');
                headerIndexes.forEach((index) => {
                    obj[csvHeaders[index]] = data[index];
                });

                return obj;
            })

            setCsvFile(file);
            setProfiles(csvDataAsObjects);
        };
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

    return (
        (isFileChosen===true) ? (
            <ButtonGroup>
                <Button mb={2} colorScheme="red" onClick={handleClearSelection}>
                    Clear
                </Button>
                <Button onClick={handleAddProfilesClick}>
                    Save data
                </Button>
            </ButtonGroup>
        ) : (
            <VStack width={width}>
                <CsvInfoButton
                    infoButtonHeader={".csv file format"}
                    infoButtonText={"include the following headers: TODO"}
                />
                <HStack>
                    <FiUploadCloud />
                    <Text>Submit a .csv file below to add student data to the offering</Text>
                </HStack>
                <Box
                    bg={'white'}
                    borderRadius="md"
                    width="100%"
                    // height="300px"
                    margin="0 3vw 5vw 3vw"
                    fontWeight="bold"
                    display="flex"
                    flexDirection="column"
                    justifyContent="center" // Center the content horizontally
                    alignItems="center" // Center the content vertically
                    border="2px dashed #24265D"
                    color="#F0EDE7"
                    transition="color 0.3s ease"
                    _hover={{ bg: '#E2E8F0', cursor: 'pointer' }}
                    cursor="pointer"
                    onDrop={(e) => {
                        handleDrop(e);
                    }}
                    onDragOver={(e) => e.preventDefault()}
                >
                    <Input
                        textColor="white"
                        type="file"
                        onChange={(e) => {
                            handleFileUpload(e);
                            setIsFileChosen(true);
                        }}
                        opacity={0}
                        left={0}
                        top={0}
                        cursor="pointer"
                        focusBorderColor='black'
                    />
                </Box>
            </VStack>
        )
    );
}

export default UploadCSV;
