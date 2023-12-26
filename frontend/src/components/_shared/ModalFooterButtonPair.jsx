import {Button, ModalFooter} from "@chakra-ui/react";
import React from "react";

const ModalFooterButtonPair = ({
    cancelButtonText,
    cancelButtonColor,
    cancelButtonOnClick,
    confirmButtonText,
    confirmButtonColor,
    confirmButtonOnClick
}) => {

    return (
        <ModalFooter>
            <Button
                onClick={cancelButtonOnClick}
                colorScheme={cancelButtonColor}
                mr={3}
            >
                {cancelButtonText}
            </Button>
            <Button
                type="submit"
                colorScheme={confirmButtonColor}
                form="create-unit"
                onClick={confirmButtonOnClick}
            >
                {confirmButtonText}
            </Button>
        </ModalFooter>
    );
}

export default ModalFooterButtonPair;