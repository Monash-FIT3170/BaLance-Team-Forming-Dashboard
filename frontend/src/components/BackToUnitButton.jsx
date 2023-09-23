import {Button, Center, HStack, Spacer, Text} from "@chakra-ui/react";
import {ArrowBackIcon} from "@chakra-ui/icons";
import React from "react";
import {useNavigate} from "react-router-dom";
import {useParams} from "react-router";

const BackToUnitButton = () => {
    const {
        unitCode,
        year,
        period
    } = useParams();

    const navigate = useNavigate();
    const navigateToOfferingDashboard = () => {
        navigate(`/students/${unitCode}/${year}/${period}`);
    };

    return(
        <Center>
            <Button onClick={navigateToOfferingDashboard}>
                <HStack>
                    <ArrowBackIcon />
                    <Spacer />
                    <Text>Return to offering dashboard</Text>
                </HStack>
            </Button>
        </Center>
    );
}

export default BackToUnitButton;
