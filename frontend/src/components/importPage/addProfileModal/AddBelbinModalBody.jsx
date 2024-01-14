import {useEffect, useState} from 'react';
import {
    FormControl,
    FormLabel,
    ModalBody,
    ModalHeader
} from "@chakra-ui/react";

import {Dropdown, TextField} from "../../_shared";

const AddBelbinModalBody = ({setValidateFields, setSuccessMsg, setNewProfile}) => {
    const [studentID, setStudentID] = useState('');
    const [belbinType, setBelbinType] = useState('');

    const successMsg = "Added belbin result to the list of profiles for submission";
    const validateFields = () => {
        const errors = [];

        if (studentID === '') {
            errors.push('student ID must be provided')
        } else if (studentID.search(/^[0-9]{8}$/) === -1) {
            errors.push('student ID must be an 8 digit number')
        }

        if (belbinType === '') {
            errors.push('belbin type must be provided')
        } else if (belbinType !== 'people' || belbinType !== 'action' || belbinType !== 'thinking') {
            errors.push('please select a belbin type')
        }

        return errors;
    }

    useEffect(() => {
        setSuccessMsg(successMsg);
        setValidateFields(validateFields);
    }, []);

    return (
        <>
            <ModalHeader>Add a Belbin personality result</ModalHeader>
            <ModalBody>
                <FormControl isRequired>
                    <TextField
                        label="Student ID"
                        value={studentID}
                        onChange={(event) => { setStudentID(event.target.value) }}
                    />
                    <FormLabel>Belbin personality type</FormLabel>
                    <Dropdown
                        placeholder={'select personality type'}
                        required={true}
                        options={['action', 'people', 'thinking']}
                        width='100%'
                        onChange={(event) => { setBelbinType(event.target.value) }}
                    />
                </FormControl>
            </ModalBody>
        </>
    );
};

export default AddBelbinModalBody;
