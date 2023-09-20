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
import {FormField} from "./FormField";
import React from "react";


const AddStudentModal = () => {

    return (
        <Modal isOpen={isAddProfileOpen} onClose={onAddProfileClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Add Profile</ModalHeader>
                <ModalBody>
                    <Divider my={4} />
                    <Box as="form" onSubmit={handleSubmit} onCancel={onAddProfileClose}>
                        <FormField
                            label="Student ID*"
                            placeholder="Enter Student ID"
                            value={currProfile.studentId}
                            onChange={(e) =>
                                setCurrProfile({ ...currProfile, studentId: e.target.value })
                            }
                        />
                        <FormField
                            label="First Name*"
                            placeholder="Enter first name"
                            value={currProfile.studentFirstName}
                            onChange={(e) =>
                                setCurrProfile({ ...currProfile, studentFirstName: e.target.value })
                            }
                        />
                        <FormField
                            label="Last Name*"
                            placeholder="Enter last name"
                            value={currProfile.studentLastName}
                            onChange={(e) =>
                                setCurrProfile({ ...currProfile, studentLastName: e.target.value })
                            }
                        />
                        <FormField
                            label="Email*"
                            placeholder="Enter email"
                            value={currProfile.studentEmailAddress}
                            onChange={(e) =>
                                setCurrProfile({ ...currProfile, studentEmailAddress: e.target.value })
                            }
                        />
                        <FormField
                            label="WAM*"
                            placeholder="Enter WAM"
                            value={currProfile.wamAverage}
                            onChange={(e) =>
                                setCurrProfile({ ...currProfile, wamAverage: e.target.value })
                            }
                        />
                        <FormField
                            label="Gender*"
                            placeholder="Select gender"
                            value={currProfile.gender}
                            onChange={(e) =>
                                setCurrProfile({ ...currProfile, gender: e.target.value })
                            }
                            options={[
                                { label: 'M', value: 'M' },
                                { label: 'F', value: 'F' },
                            ]}
                        />
                        <FormField
                            label="Lab ID*"
                            placeholder="Enter Lab ID"
                            value={currProfile.labId}
                            onChange={(e) =>
                                setCurrProfile({ ...currProfile, labId: e.target.value })
                            }
                        />
                        <FormField
                            label="Enrolment Status*"
                            placeholder="Enter Enrolment Status"
                            value={currProfile.enrolmentStatusd}
                            onChange={(e) =>
                                setCurrProfile({ ...currProfile, enrolmentStatus: e.target.value })
                            }
                            options={[
                                { label: 'Active', value: 'ACTIVE' },
                                { label: 'Inactive', value: 'INACTIVE' },
                            ]}
                        />
                        <FormField
                            label="Belbin Type"
                            placeholder="Select Belbin Type"
                            value={currProfile.belbinType}
                            onChange={(e) =>
                                setCurrProfile({ ...currProfile, belbinType: e.target.value })
                            }
                            options={[
                                { label: 'Thinking', value: 'Thinking' },
                                { label: 'People', value: 'People' },
                                { label: 'Action', value: 'Action' },
                            ]}
                        />
                        <FormField
                            label="Hours of Contribution"
                            placeholder="Enter hours"
                            value={currProfile.hours}
                            onChange={(e) =>
                                setCurrProfile({ ...currProfile, hours: e.target.value })
                            }
                        />
                        <FormField
                            label="Average Mark"
                            placeholder="Enter Average Mark"
                            value={currProfile.averageMark}
                            onChange={(e) =>
                                setCurrProfile({ ...currProfile, averageMark: e.target.value })
                            }
                        />
                    </Box>
                </ModalBody>

                <ModalFooter>
                    <Button type="submit" colorScheme="blue" mr={3} onClick={handleSubmit}>
                        Save
                    </Button>
                    <Button onClick={onAddProfileClose}>Cancel</Button>
                </ModalFooter>

            </ModalContent>
        </Modal>
    );
}

export default AddStudentModal;