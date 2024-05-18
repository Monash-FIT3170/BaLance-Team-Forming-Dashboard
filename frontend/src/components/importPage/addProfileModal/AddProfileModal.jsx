import AddStudentModalBody from "./AddStudentModalBody";
import AddBelbinModalBody from "./AddBelbinModalBody";
import AddEffortModalBody from "./AddEffortModalBody";
import AddTimeModalBody from "./AddTimeModalBody";

const AddProfileModal = ({dataType, profilesList, setProfilesList, isOpen, onClose}) => {

    const renderModalBody = () => {
        /**
         * Returns a different form based on what data type the user has selected
         * to upload
         *
         */

        switch (dataType) {
            case "students":
                return <AddStudentModalBody
                    isOpen={isOpen}
                    onClose={onClose}
                    profilesList={profilesList}
                    setProfilesList={setProfilesList}
                />

            case "effort":
                return <AddEffortModalBody
                    isOpen={isOpen}
                    onClose={onClose}
                    profilesList={profilesList}
                    setProfilesList={setProfilesList}
                />

            case "belbin":
                return <AddBelbinModalBody
                    isOpen={isOpen}
                    onClose={onClose}
                    profilesList={profilesList}
                    setProfilesList={setProfilesList}
                />
            case "times":
                return <AddTimeModalBody
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

export default AddProfileModal;