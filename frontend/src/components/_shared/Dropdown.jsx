import {
    Select,
    Text,
    VStack
} from "@chakra-ui/react";


const Dropdown = ({dropDownDesc, placeholder, required, options, width, onChange, defaultValue}) => {
    /**
     * options: a list of strings, each will become a dropdown choice
     */

    return (
        <VStack>
            {dropDownDesc ? <Text marginRight={"auto"}>{dropDownDesc}</Text> : null}
            <Select
                required={required}
                placeholder={placeholder}
                width={width}
                onChange={onChange}
                defaultValue={defaultValue ? defaultValue : null}
                mb="5"
            >
                {options.map((option) => {
                    return <option value={option} label={option} key={option}/>
                })}
            </Select>
        </VStack>

    )
}

export default Dropdown;