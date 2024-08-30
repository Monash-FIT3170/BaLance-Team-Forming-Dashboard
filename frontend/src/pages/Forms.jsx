import { useState } from 'react';
import { useParams } from 'react-router';
import { AddIcon, ArrowBackIcon } from "@chakra-ui/icons";
import {
    Flex,
    VStack,
    Center,
    Text,
    Button,
    useDisclosure,
    Box,
    SimpleGrid,
} from '@chakra-ui/react';

import {
    NavButton,
    PageHeader
} from "../components/_shared";
import CreateFormModal from "../components/homePage/CreateFormModal";

const Forms = () => {
    const { unitCode, year, period } = useParams();
    const { isOpen, onOpen, onClose } = useDisclosure();

    const renderFormCard = (form) => (
        <Box
            key={form.id}
            p={4}
            shadow="md"
            borderWidth="1px"
            borderRadius="md"
            width="100%"
        >
            <Text fontWeight="bold">{form.title}</Text>
            <Text color="gray.500">{form.status}</Text>
        </Box>
    );

    return (
        <VStack spacing={6}>
            <PageHeader
                fontSize={"2xl"}
                pageDesc={`Google Form Options: ${unitCode} ${period} ${year}`}
            />
            <Center>
                <NavButton
                    buttonIcon={<ArrowBackIcon />}
                    buttonText="Return to offering dashboard"
                    buttonUrl={`/students/${unitCode}/${year}/${period}`}
                />
            </Center>

            <Center>
                <Button
                    leftIcon={<AddIcon />}
                    onClick={onOpen} // Opens the modal
                >
                    Open New Google Form
                </Button>
            </Center>

            {/* Placeholder for Open Forms */}
            <Box width="80%">
                <Text fontSize="xl" fontWeight="bold" mb={4}>
                    Forms In Prograss
                </Text>
            </Box>

            {/* Placeholder for Finished Forms */}
            <Box width="80%">
                <Text fontSize="xl" fontWeight="bold" mt={8} mb={4}>
                    Finished Forms
                </Text>
            </Box>

            {/* Modal for creating a new form */}
            <CreateFormModal isModalOpen={isOpen} onModalClose={onClose} />
        </VStack>
    );
}

export default Forms;
