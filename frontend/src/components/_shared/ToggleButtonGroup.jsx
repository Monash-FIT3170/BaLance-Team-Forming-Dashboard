import { useNavigate } from "react-router-dom";
import { Button, ButtonGroup } from "@chakra-ui/react";

const ToggleButtonGroup = ({
    leftButtonIsDisabled,
    leftButtonUrl,
    leftButtonText,
    rightButtonIsDisabled,
    rightButtonUrl,
    rightButtonText
}) => {
    const navigate = useNavigate();

    return (
        <ButtonGroup colorScheme="#282c34" variant="outline" size="lg" isAttached>
            <Button
                isDisabled={leftButtonIsDisabled}
                onClick={() => navigate(leftButtonUrl)}
            >
                {leftButtonText}
            </Button>
            <Button
                isDisabled={rightButtonIsDisabled}
                onClick={() => navigate(rightButtonUrl)}
            >
                {rightButtonText}
            </Button>
        </ButtonGroup>
    )
}

export default ToggleButtonGroup;