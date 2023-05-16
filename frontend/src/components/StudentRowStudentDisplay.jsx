import {Tr, Td, HStack, Select} from "@chakra-ui/react";
import { CloseIcon } from '@chakra-ui/icons'

const StudentRow2=(props)=> {
    /*HTML component for each student in each group in the 'List Students' View*/
    // desctructure the content of props
    const {studentFirstName, studentEmail,labId, groupNumber} = props.props

    return (
        <Tr>
            <Td>
                <HStack>
                    <button><CloseIcon /></button>
                </HStack>
            </Td>
            <Td>{studentFirstName}</Td>
            <Td>{studentEmail}</Td>
            <Td>{labId}</Td>
            <Td>
            <Select bg="white"> 
                <option value='option1'>Group 1</option>
                <option value='option2'>Group 2</option>
                <option value='option3'>Group 3</option>
            </Select>
            </Td>
        </Tr>
    )
}

export default StudentRow2