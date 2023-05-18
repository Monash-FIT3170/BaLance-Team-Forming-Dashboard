import {Tr, Td, HStack, Select} from "@chakra-ui/react";
import { CloseIcon } from '@chakra-ui/icons'

const StudentRow2=(props)=> {
    /*HTML component for each student in each group in the 'List Students' View*/
    // desctructure the content of props
    const {studentFirstName, studentEmail, group} = props.props

    return (
        <Tr>
            <Td>{studentFirstName}</Td>
            <Td>{studentEmail}</Td>
            <Td>{group.labId}</Td>
            <Td>
            <Select bg="white" placeholder = {"Group: " + group.groupNumber}> 
                <option value='option1'>Group 1</option>
                <option value='option2'>Group 2</option>
                <option value='option3'>Group 3</option>
            </Select>
            </Td>
        </Tr>
    )
}

export default StudentRow2