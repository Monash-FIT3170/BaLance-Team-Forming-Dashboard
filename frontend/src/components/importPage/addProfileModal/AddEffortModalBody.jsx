import {useState} from "react";
import {
    FormControl,
    ModalBody,
    ModalHeader,
    useToast
} from "@chakra-ui/react";

import {TextField} from "../../_shared";

const AddEffortModalBody = ({setValidateFields, setSuccessMsg, setNewProfile}) => {
    const [studentID, setStudentID] = useState('');
    const [hourCommitment, setHourCommitment] = useState('');
    const [avgAssignmentMark, setAvgAssignmentMark] = useState('');

    const toast = useToast();


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
