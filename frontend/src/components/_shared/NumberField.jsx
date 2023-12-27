import {
    NumberDecrementStepper,
    NumberIncrementStepper,
    NumberInput,
    NumberInputField,
    NumberInputStepper
} from "@chakra-ui/react";

const NumberField = ({
    defaultValue,
    minValue,
    onChange
}) => {

    return (
        <NumberInput
            allowMouseWheel
            size='md'
            defaultValue={defaultValue}
            min={minValue}
            onChange={onChange}
        >
            <NumberInputField />
            <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
            </NumberInputStepper>
        </NumberInput>
    )
}

export default NumberField;