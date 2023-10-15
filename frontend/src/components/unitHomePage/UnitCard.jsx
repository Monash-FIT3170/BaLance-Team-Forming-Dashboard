//imports
import {
    Box,
    Button,
    Icon,
    Text,
    useColorModeValue,
    useDisclosure,
    VStack,
    HStack,
    useToast, Spacer,
} from '@chakra-ui/react';
import { FaTrash } from 'react-icons/fa';
import { FaUser } from 'react-icons/fa';
import getToastSettings from '../shared/ToastSettings';
import { useNavigate } from 'react-router-dom';
import { MockAuth } from '../../helpers/mockAuth';
import { useAuth0 } from '@auth0/auth0-react';
import PageHeader from "../shared/PageHeader";
import React from "react";

const UnitCard = (unit) => {

    console.log(unit)

    const {
        unit_code,
        unit_name,
        unit_off_year,
        unit_off_period,
        enrolment_count
    } = unit


    // Add more colours after testing
    const topBoxColors = [
        useColorModeValue('#24265D', 'gray.700'),
        useColorModeValue('#FF9900', 'gray.700'),
        useColorModeValue('#0089FF', 'gray.700'),
        useColorModeValue('#CC00FF', 'gray.700'),
        useColorModeValue('#FF0000', 'gray.700'),
    ];

    // Change 0 to index & test
    const topBoxColor = topBoxColors[0 % topBoxColors.length];

    let boxBg = useColorModeValue('gray.600');
    let mainText = useColorModeValue('gray.800', 'white');
    let secondaryText = useColorModeValue('gray.600', 'gray.600');
    let iconBox = useColorModeValue('#F1EFEF');
    let iconColor = useColorModeValue('brand.200', 'white');

    let authService = {
        DEV: MockAuth,
        TEST: useAuth0,
    };

    const { getAccessTokenSilently } = authService[process.env.REACT_APP_AUTH]();

    const toast = useToast();
    const getToast = (title, status) => {
        toast.closeAll();
        toast(getToastSettings(title, status));
    };

    const {
        isOpen: isOpenDetails,
        onOpen: onOpenDetails,
        onClose: onCloseDetails,
    } = useDisclosure();

    const navigate = useNavigate();

    //navigate to the groups for the current unit if it is clicked
    const navigateToUnitOffering = () =>
        navigate(`/students/${unit_code}/${unit_off_year}/${unit_off_period}`);

    // handle delete unit and posting it to the backend
    const handleDeleteUnit = (event) => {
        getAccessTokenSilently().then((token) => {
            fetch(
                `http://localhost:8080/api/units/${unit_code}/${unit_off_year}/${unit_off_period}`, {
                    method: 'DELETE',
                    headers: new Headers({
                        Authorization: `Bearer ${token}`
                    })
                }
            );
            getToast('Unit deleted successfully', 'success');
            setTimeout(() => {
                onCloseDetails();
                window.location.reload();
            }, 1500);
        });
    };

    return (
        <Box
            as="button"
            onClick={navigateToUnitOffering}
            width='360px'
            height='150px'
            backgroundColor='#E6EBF0'
            borderRadius='5px'
            pb={'1em'}
            position="relative"
        >
            <Box
                width='100%'
                height='1em'
                backgroundColor={topBoxColor}
                borderTopLeftRadius='5px'
                borderTopRightRadius='5px'
            />
            <VStack flexGrow={1} width="100%">
                <HStack width="100%">
                    <Icon
                        as={FaUser}
                        color="black"
                        boxSize="20px"
                        margin={2}
                    />
                    <Text></Text>
                    <Button onClick={handleDeleteUnit} p={0} bg="transparent">
                        <Icon
                            as={FaTrash}
                            color="black"
                            boxSize="20px"
                            style={{
                            marginLeft: '270px',
                            }}
                        />
                    </Button>
                </HStack>
                <Text
                    fontSize='2xl'
                    fontWeight="bold"
                    align={'left'}
                >
                    {`${unit_code} ${unit_off_year} ${unit_off_period}`}
                </Text>
                <Text
                    align={'left'}
                >
                    {unit_name}
                </Text>
            </VStack>
        </Box>
    );
};

export default UnitCard;
