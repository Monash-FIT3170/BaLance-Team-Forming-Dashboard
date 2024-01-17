import EditStudentModal from "./EditStudentModal";
import EditBelbinModal from "./EditBelbinModal";
import EditEffortModal from "./EditEffortModal";

const EditProfileModal = ({dataType, profilesList, setProfilesList, isOpen, onClose}) => {

    const renderModalBody = () => {
        /**
         * Returns a different form based on what data type the user has selected
         * to upload
         *
         */

        switch (dataType) {
            case "students":
                return <EditStudentModal
                    isOpen={isOpen}
                    onClose={onClose}
                    profilesList={profilesList}
                    setProfilesList={setProfilesList}
                />

            case "effort":
                return <EditEffortModal
                    isOpen={isOpen}
                    onClose={onClose}
                    profilesList={profilesList}
                    setProfilesList={setProfilesList}
                />

            case "belbin":
                return <EditBelbinModal
                    isOpen={isOpen}
                    onClose={onClose}
                    profilesList={profilesList}
                    setProfilesList={setProfilesList}
                />
        }
    }

    return (
        renderModalBody()
    )
}

export default EditProfileModal;