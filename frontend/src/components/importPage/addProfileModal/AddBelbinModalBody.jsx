import {
    FormControl,
    ModalBody,
    ModalHeader,
    useToast
} from "@chakra-ui/react";


const AddBelbinModalBody = ({setValidateFields, setSuccessMsg, setNewProfile}) => {
    const toast = useToast();

    return (
        <>
            <ModalHeader>Add a Belbin personality result</ModalHeader>
            <ModalBody>
                {/* formControl TODO */}

            </ModalBody>
        </>
    );
};

export default AddBelbinModalBody;
