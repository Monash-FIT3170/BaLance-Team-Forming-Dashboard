import { NumberInput, FormLabel, NumberInputField, NumberDecrementStepper, NumberIncrementStepper, NumberInputStepper } from "@chakra-ui/react";
import React from "react";
const InputNumber = ({
    label,
    defaultValue,
    min,
    onChange,
    value
}) => {
  return (
    <div>
      <FormLabel>{label}</FormLabel>
      <NumberInput defaultValue={defaultValue} min={min} onChange={onChange} mb="5">
        <NumberInputField />
        <NumberInputStepper>
          <NumberIncrementStepper />
          <NumberDecrementStepper />
        </NumberInputStepper>
      </NumberInput>
    </div>
  )
}

export default InputNumber;