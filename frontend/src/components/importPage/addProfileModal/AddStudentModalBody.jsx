import { useState } from 'react';
import {
    FormControl,
    FormLabel,
    ModalBody,
    ModalHeader
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

    setSuccessMsg("Added student to the list of profiles for submission")

    setValidateFields(() => {
        const errors = [];

        if (studentID === '') {
            errors.push('student ID must be provided')
        } else if (studentID.search(/^[0-9]{8}$/) === -1) {
            errors.push('student ID must be an 8 digit number')
        }

        if (prefName === '') {
            errors.push('preferred name must be provided')
        } else if (prefName.search(/^[A-Za-z]{1,20}$/) === -1) {
            errors.push('preferred name must contain letters only and cannot exceed 20 characters')
        }

        if (lastName === '') {
            errors.push('preferred name must be provided')
        } else if (lastName.search(/^[A-Za-z]{1,20}$/) === -1) {
            errors.push('preferred name must contain letters only and cannot exceed 20 characters')
        }

        if (email === '') {
            errors.push('email must be provided');
        } else if (email.search(/^.+@.+$/) === -1) {
            errors.push('email is not valid');
        }

        if (wam === '') {
            errors.push('wam must be provided')
        } else if (wam.search(/^[0-9]{8}$/) === -1 && wam.toString() > 100) {
            errors.push('wam must be a number between 0 and 100')
        }

        if (lab === '') {
            errors.push('lab must be provided')
        } else if (lab.search(/^[0-9]{1,3}$/) === -1) {
            errors.push('lab must be numerical')
        }

        if (gender === '') {
            errors.push('gender must be provided')
        } else if (gender !== 'F' || gender !== 'M') {
            errors.push('please select a gender')
        }

        return errors;
    })

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
