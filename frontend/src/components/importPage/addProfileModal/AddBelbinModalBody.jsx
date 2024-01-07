import {useState} from 'react';
import {
    FormControl,
    ModalBody,
    ModalHeader,
    useToast
} from "@chakra-ui/react";

import {TextField} from "../../_shared";

const AddBelbinModalBody = ({setValidateFields, setSuccessMsg, setNewProfile}) => {
    const [studentID, setStudentID] = useState('');
    const [belbinType, setBelbinType] = useState('');

    const toast = useToast();

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
                    <TextField
                        label="Belbin personality type"
                        value={belbinType}
                        onChange={(event) => { setBelbinType(event.target.value) }}
                    />
                </FormControl>
            </ModalBody>
        </>
    );
};

export default AddBelbinModalBody;
