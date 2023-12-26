import {FormLabel, Input} from "@chakra-ui/react";
import React from "react";

const TextField = ({
    label,
    value,
    onChange
}) => {

    return (
        <div>
            <FormLabel>{label}</FormLabel>
            <Input
                mb="5"
                value={value}
                onChange={onChange}
            />
        </div>
    );
}

export default TextField;