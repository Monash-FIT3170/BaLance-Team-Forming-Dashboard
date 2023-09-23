import * as React from 'react';
import {
    Box, Text, Button, Input, HStack, ButtonGroup, VStack,
} from '@chakra-ui/react';
import {FiUploadCloud} from 'react-icons/fi';
import {CsvInfoButton} from "./CsvInfoButton";

const UploadCSV = ({infoButtonHeader, infoButtonText, handleUpload, setIsFileChosen}) => {
    return (
        <VStack>
            <CsvInfoButton
                infoHeader={infoButtonHeader}
                infoText={infoButtonText}
            />
            <HStack>
                <FiUploadCloud />
                <Text>Submit a .csv file below to add student data to the offering</Text>
            </HStack>
            <Box
            bg={'white'}
            borderRadius="md"
            width="100%"
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
            >
                <Input
                    textColor="white"
                    type="file"
                    onChange={(e) => {
                        handleUpload(e);
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
    );
}

export default UploadCSV;
