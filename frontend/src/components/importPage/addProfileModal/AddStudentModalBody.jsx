import { useState } from 'react';
import {
    FormControl,
    FormLabel,
    ModalBody,
    ModalHeader,
    Text,
    useToast
} from "@chakra-ui/react";

import { Dropdown, TextField } from "../../_shared";


const AddStudentModalBody = ({setValidateFields, setSuccessMsg, setNewProfile}) => {
    const [studentID, setStudentID] = useState('');
    const [prefName, setPrefName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [wam, setWam] = useState('');
    const [lab, setLab] = useState('');
    const [gender, setGender] = useState('');
    const toast = useToast();



    return (
        <>
            <ModalHeader>Add a new student</ModalHeader>
            <ModalBody>
                <FormControl isRequired>
                    <TextField
                        label="Student ID"
                        value={studentID}
                        onChange={(event) => { setStudentID(event.target.value) }}
                    />
                    <TextField
                        label="Preferred name"
                        value={prefName}
                        onChange={(event) => { setPrefName(event.target.value) }}
                    />
                    <TextField
                        label="Last name"
                        value={lastName}
                        onChange={(event) => { setLastName(event.target.value) }}
                    />
                    <TextField
                        label="Student email address"
                        value={email}
                        onChange={(event) => { setEmail(event.target.value) }}
                    />
                    <TextField
                        label="Student WAM"
                        value={wam}
                        onChange={(event) => { setWam(event.target.value) }}
                    />
                    <TextField
                        label="Student lab number"
                        value={lab}
                        onChange={(event) => { setLab(event.target.value) }}
                    />
                    <FormLabel>Gender</FormLabel>
                    <Dropdown
                        placeholder={'select gender'}
                        required={true}
                        options={['M', 'F']}
                        width='100%'
                        onChange={(event) => { setGender(event.target.value) }}
                    />
                </FormControl>
            </ModalBody>
        </>
    );
};

export default AddStudentModalBody;
