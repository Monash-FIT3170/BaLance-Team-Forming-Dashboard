import {Select} from "@chakra-ui/react";
import React from "react";


const DropdownDynamic = ({placeholder, options, width}) => {
    /**
     * options: a list of strings, each will become a dropdown choice
     */

    return (
        <Select placeholder={placeholder} width={width}>
            {options.map((option) => {
                return <option value={option} label={option}/>
            })}
        </Select>
    )
}

export default DropdownDynamic;