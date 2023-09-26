import {Select, Text, VStack} from "@chakra-ui/react";
import React from "react";


const DropdownDynamic = ({dropDownDesc, placeholder, options, width, onChange}) => {
    /**
     * options: a list of strings, each will become a dropdown choice
     */

    return (
        <VStack>
            {dropDownDesc ? <Text marginRight={"auto"}>{dropDownDesc}</Text> : null}
            <Select
                placeholder={placeholder}
                width={width}
                onChange={onChange}
            >
                {options.map((option) => {
                    return <option value={option} label={option}/>
                })}
            </Select>
        </VStack>

    )
}

export default DropdownDynamic;