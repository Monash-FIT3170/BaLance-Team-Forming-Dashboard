import {
    Button,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay
} from "@chakra-ui/react";

import FormField from "../FormField";

const EditStudentModal = ({
    isEditProfileOpen,
    onEditProfileClose,
    currProfile,
    setCurrProfile,
    profiles,
    setProfiles
}) => {

    const handleAttributeChange = (key, value) => {
        setCurrProfile({
            ...currProfile,
            [key]: value,
        });
    };

    const handleSaveProfile = (updatedProfile) => {
        // Find the index of the profile in the profiles array
        const index = profiles.findIndex(
            (profile) => profile.studentEmailAddress === currProfile.studentEmailAddress
        );
        if (updatedProfile.averageMark !== "" && updatedProfile.hours !== "") {
            updatedProfile['marksPerHour'] = updatedProfile.averageMark / updatedProfile.hours
        }
        // Update the profile object with the new values
        const updatedProfiles = [...profiles];
        updatedProfiles[index] = { ...updatedProfile };

        // Update the profiles state with the updated profile object
        setProfiles(updatedProfiles);
        setCurrProfile(null);

        // Close the edit modal
        onEditProfileClose();
    };



    return (
        <Modal isOpen={isEditProfileOpen} onClose={onEditProfileClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Edit Profile</ModalHeader>
                <ModalBody>
                    <FormField
                        label="Student ID"
                        value={currProfile?.studentId}
                        onChange={(e) => handleAttributeChange('studentId', e.target.value)}
                    />
                    <FormField
                        label="First Name"
                        value={currProfile?.studentFirstName}
                        onChange={(e) =>
                            handleAttributeChange('studentFirstName', e.target.value)
                        }
                    />
                    <FormField
                        label="Last Name"
                        value={currProfile?.studentLastName}
                        onChange={(e) =>
                            handleAttributeChange('studentLastName', e.target.value)
                        }
                    />
                    <FormField
                        label="Email Address"
                        placeholder="Email Address"
                        value={currProfile?.studentEmailAddress}
                        onChange={(e) =>
                            handleAttributeChange('studentEmailAddress', e.target.value)
                        }
                    />
                    <FormField
                        label="WAM"
                        placeholder="WAM"
                        value={currProfile?.wamAverage}
                        onChange={(e) => handleAttributeChange('wamAverage', e.target.value)}
                    />
                    <FormField
                        label="Gender"
                        placeholder="Select Gender"
                        value={currProfile?.gender}
                        onChange={(e) => handleAttributeChange('gender', e.target.value)}
                        options={[
                            { label: 'M', value: 'M' },
                            { label: 'F', value: 'F' },
                        ]}
                    />
                    <FormField
                        label="Lab ID"
                        placeholder="Lab ID"
                        value={currProfile?.labId}
                        onChange={(e) => handleAttributeChange('labId', e.target.value)}
                    />
                    <FormField
                        label="Enrolment Status"
                        placeholder="Select Enrolment Status"
                        value={currProfile?.enrolmentStatus}
                        onChange={(e) =>
                            handleAttributeChange('enrolmentStatus', e.target.value)
                        }
                        options={[
                            { label: 'Active', value: 'ACTIVE' },
                            { label: 'Inactive', value: 'INACTIVE' },
                        ]}
                    />
                    <FormField
                        label="Belbin Type"
                        placeholder="Select Personality Type"
                        value={currProfile?.belbinType}
                        onChange={(e) =>
                            handleAttributeChange('belbinType', e.target.value)
                        }
                        options={[
                            { label: 'Action', value: 'action' },
                            { label: 'People', value: 'people' },
                            { label: 'Thinking', value: 'thinking' }
                        ]}
                    />
                    <FormField
                        label="Hours"
                        placeholder="Hours"
                        value={currProfile?.hours}
                        onChange={(e) => handleAttributeChange('hours', e.target.value)}
                    />
                    <FormField
                        label="Average Marks"
                        placeholder="Average Mark"
                        value={currProfile?.averageMark}
                        onChange={(e) => handleAttributeChange('averageMark', e.target.value)}
                    />
                </ModalBody>
                <ModalFooter>
                    <Button
                        onClick={() => handleSaveProfile(currProfile)}
                        type="submit"
                        colorScheme="green"
                        mr={3}
                    >
                        Save
                    </Button>
                    <Button
                        onClick={() => {
                            onEditProfileClose();
                        }}
                    >
                        Cancel
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}

export default EditStudentModal;