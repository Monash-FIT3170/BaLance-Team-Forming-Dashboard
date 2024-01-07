import {
    FormControl,
    ModalBody,
    ModalHeader,
    Text,
    useToast
} from "@chakra-ui/react";


const AddStudentModalBody = ({setValidateFields, setSuccessMsg, setNewProfile}) => {
    const toast = useToast();

    return (
        <>
            <ModalHeader>Add a new student</ModalHeader>
            <ModalBody>
                {/* formControl TODO */}

            </ModalBody>
        </>
    );
};

export default AddStudentModalBody;
