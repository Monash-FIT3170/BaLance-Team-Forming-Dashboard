import { useState } from 'react';
import { useParams } from 'react-router';
import { AddIcon, ArrowBackIcon } from "@chakra-ui/icons";
import {
    Flex,
    Spacer,
    VStack,
    Center,
    HStack,
    Text,
    Button,
    useDisclosure // Add the useDisclosure import
} from '@chakra-ui/react';

import csvHeaderMapping from "../helpers/csvHeaderMapping";
import {
    Dropdown,
    NavButton,
    PageHeader
} from "../components/_shared";
import {
    DeleteProfileModal,
    ConfirmClearSelection,
    UploadCSV,
    CsvPreviewTable,
    AddProfileModal,
    EditProfileModal
} from "../components/importPage"
import CreateFormModal from "../components/homePage/CreateFormModal";

// API thing here?

const Forms = () => {
    
    const {
        unitCode,
        year,
        period
    } = useParams();

    const { isOpen, onOpen, onClose } = useDisclosure(); // Add the missing variables and hook

    return (
        <VStack>
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

            {/* Modal for creating a new form */}
            <CreateFormModal isModalOpen={isOpen} onModalClose={onClose} />
        </VStack>
    );
}


export default Forms;