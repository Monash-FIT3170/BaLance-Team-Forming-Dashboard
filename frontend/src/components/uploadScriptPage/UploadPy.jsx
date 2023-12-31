import { FiUploadCloud } from 'react-icons/fi';
import {
    Box,
    Text,
    HStack,
    Input
} from '@chakra-ui/react';

function UploadPy({ pyFile, handleUpload }) {
    return (
        <Box
            bg={pyFile ? '#00ADB5' : 'white'}
            borderRadius="md"
            width="100%"
            fontWeight="bold"
            display="flex"
            flexDirection="column"
            justifyContent="center" // Center the content horizontally
            alignItems="center" // Center the content vertically
            border="2px dashed #24265D"
            color= "black"
            transition="color 0.3s ease"
            _hover={{ bg: '#E2E8F0', cursor: 'pointer' }}
            cursor="pointer"
        >
            <HStack>
                <FiUploadCloud />
                <Text>
                    {pyFile ? `File: ${pyFile.name}` : 'Submit a .py file'}
                </Text>
            </HStack>
            <Input
                textColor="white"
                type="file"
                onChange={(e) => handleUpload(e)}
                opacity={0}
                left={0}
                top={0}
                cursor="pointer"
                focusBorderColor='black'
            />
        </Box>
    );
}

export default UploadPy;

