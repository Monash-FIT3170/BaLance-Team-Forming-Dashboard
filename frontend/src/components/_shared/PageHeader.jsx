import { Box, Text } from "@chakra-ui/react";

const PageHeader = ({fontSize, pageDesc}) => {
    return (
        <Box as="header" p="4" textAlign="center">
            <Text fontSize={fontSize} fontWeight="bold">
                {pageDesc}
            </Text>
        </Box>
    );
}

export default PageHeader;