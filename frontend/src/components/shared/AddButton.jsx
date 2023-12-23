import {Button, HStack, Spacer, Text} from "@chakra-ui/react";
import {AddIcon} from "@chakra-ui/icons";
import React from "react";

const AddButton = ({onClick, buttonText, width, height}) => {
    return (
        <Button
            width={width ? width : '10em'}
            height={height ? height : '2.75em'}
            onClick={onClick}
            colorScheme="gray"
            margin-left="20">
            <HStack>
                <AddIcon />
                <Spacer />
                <Text>{buttonText}</Text>
            </HStack>
        </Button>
    )
}

export default AddButton;