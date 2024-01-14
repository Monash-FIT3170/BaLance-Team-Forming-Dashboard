import {useEffect, useState} from "react";
import {
    FormControl,
    ModalBody,
    ModalHeader
} from "@chakra-ui/react";

import {TextField} from "../../_shared";

const AddEffortModalBody = ({setValidateFields, setSuccessMsg, setNewProfile}) => {
    const [studentID, setStudentID] = useState('');
    const [hourCommitment, setHourCommitment] = useState('');
    const [avgAssignmentMark, setAvgAssignmentMark] = useState('');

    const successMsg = "Added effort result to the list of profiles for submission";
    const validateFields = () => {
        const errors = [];

        if (studentID === '') {
            errors.push('student ID must be provided')
        } else if (studentID.search(/^[0-9]{8}$/) === -1) {
            errors.push('student ID must be an 8 digit number')
        }

        if (hourCommitment === '') {
            errors.push('weekly hour commitment must be provided')
        } else if (hourCommitment.search(/^[0-9]{3}$/) === -1 && hourCommitment.toString() > 168) {
            errors.push('weekly hour commitment must be a number between 0 and 168')
        }

        if (avgAssignmentMark === '') {
            errors.push('average assignment marks must be provided')
        } else if (avgAssignmentMark.search(/^[0-9]{8}$/) === -1 && avgAssignmentMark.toString() > 100) {
            errors.push('average assignment marks must be a number between 0 and 100')
        }

        return errors;
    }

    useEffect(() => {
        setSuccessMsg(successMsg);
        setValidateFields(() => validateFields);
    }, [setValidateFields]);

    return (
        <>
            <ModalHeader>Add an Effort personality result</ModalHeader>
            <ModalBody>
                <FormControl isRequired>
                    <TextField
                        label="Student ID"
                        value={studentID}
                        onChange={(event) => { setStudentID(event.target.value) }}
                    />
                    <TextField
                        label="Weekly hour commitment"
                        value={hourCommitment}
                        onChange={(event) => { setHourCommitment(event.target.value) }}
                    />
                    <TextField
                        label="Average assignment mark"
                        value={avgAssignmentMark}
                        onChange={(event) => { setAvgAssignmentMark(event.target.value) }}
                    />
                </FormControl>
            </ModalBody>
        </>
    );
};

export default AddEffortModalBody;
