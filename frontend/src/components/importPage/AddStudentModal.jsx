import {
    Box,
    Button,
    Divider,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay
} from "@chakra-ui/react";
import FormField from "./FormField";
import React from "react";

const AddStudentModal = (
    isAddProfileOpen,
    onAddProfileClose,
    handleSubmit,
    currProfile,
    setCurrProfile,
) => {

    // TODO move outside and inject as prop
    const fields = [
        {
            label: "Student ID",
            placeholder: "Enter student ID",
            value: currProfile.studentId,
            onChange: (e) => setCurrProfile({ ...currProfile, studentId: e.target.value })
        },
        {
            label: "First Name",
            placeholder: "Enter student first name",
            value: currProfile.studentFirstName,
            onChange: (e) => setCurrProfile({ ...currProfile, studentFirstName: e.target.value })
        },
        {
            label: "Last Name",
            placeholder: "Enter student last name",
            value: currProfile.studentLastName,
            onChange: (e) => setCurrProfile({ ...currProfile, studentLastName: e.target.value })
        },
        {
            label: "Email",
            placeholder: "Enter student email address",
            value: currProfile.studentEmailAddress,
            onChange: (e) => setCurrProfile({ ...currProfile, studentEmailAddress: e.target.value })
        },
        {
            label: "WAM",
            placeholder: "Enter student WAM",
            value: currProfile.wamAverage,
            onChange: (e) => setCurrProfile({ ...currProfile, wamAverage: e.target.value })
        },
        {
            label: "Lab ID",
            placeholder: "Enter the ID of the lab student is in",
            value: currProfile.labId,
            onChange: (e) => setCurrProfile({ ...currProfile, labId: e.target.value })
        },
        {
            label: "Gender",
            placeholder: "Enter student gender",
            value: currProfile.gender,
            onChange: (e) => setCurrProfile({ ...currProfile, gender: e.target.value }),
            fieldOptions:[
                    { label: 'M', value: 'M' },
                    { label: 'F', value: 'F' },
                ]
        }
    ]

    const renderFormFields = (fields) => {
        return fields.map((field) => {
            return <FormField
                label={field.label}
                placeholder={field.placeholder}
                value={field.value}
                onChange={field.onChange ?? null}
            />
        })
    }

    return (
        <Modal isOpen={isAddProfileOpen} onClose={onAddProfileClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>
                    Add Profile
                </ModalHeader>

                <ModalBody>
                    <Divider my={4} />
                    <Box as="form" onSubmit={handleSubmit} onCancel={onAddProfileClose}>
                        {renderFormFields(fields)}
                    </Box>
                </ModalBody>

                <ModalFooter>
                    <Button type="submit" colorScheme="blue" mr={3} onClick={handleSubmit} text="Save"/>
                    <Button onClick={onAddProfileClose} text="Close"/>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}

export default AddStudentModal;