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
    useDisclosure
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

// API thing here?

const Forms = () => {
    
    const {
        unitCode,
        year,
        period
    } = useParams();

    return (
        <VStack>
            <PageHeader
                fontSize={"2xl"}
                pageDesc={`Form Options: ${unitCode} ${period} ${year}`}
            />

        </VStack>
    );
}

export default Forms;