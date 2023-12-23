import {Button, HStack, Spacer, Text} from "@chakra-ui/react";
import React from "react";
import {useNavigate} from "react-router-dom";

const NavButton = ({ buttonIcon, buttonText, buttonUrl, onClick }) => {
    const navigate = useNavigate();
    const navigateToUrl = () => {
        navigate(buttonUrl)
    }

    return(
        <Button onClick={buttonUrl ? navigateToUrl : onClick}>
            <HStack>
                {buttonIcon}
                <Spacer />
                <Text>{buttonText}</Text>
            </HStack>
        </Button>
    );
}

export default NavButton;
