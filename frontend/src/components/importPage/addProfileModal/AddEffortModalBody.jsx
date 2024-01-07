import {
    FormControl,
    ModalBody,
    ModalHeader,
    useToast
} from "@chakra-ui/react";


const AddEffortModalBody = ({setValidateFields, setSuccessMsg, setNewProfile}) => {
    const toast = useToast();

    // use effect to assign handleSubmit

    return (
        <>
            <ModalHeader>Add an Effort personality result</ModalHeader>
            <ModalBody>
                {/* formControl TODO */}

            </ModalBody>
        </>
    );
};

export default AddEffortModalBody;
