import {
    Button,
    Center,
    Flex,
    FormControl,
    FormLabel,
    Input, Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent, ModalFooter,
    ModalHeader,
    ModalOverlay,
    NumberDecrementStepper,
    NumberIncrementStepper,
    NumberInput,
    NumberInputField,
    NumberInputStepper, Radio, RadioGroup,
    Select, Stack, Text, useToast
} from "@chakra-ui/react";
import React, {useState} from "react";
import {useNavigate} from "react-router-dom";
import getToastSettings from "../shared/ToastSettings";
import {MockAuth} from "../../helpers/mockAuth";
import {useAuth0} from "@auth0/auth0-react";
import DropdownDynamic from "../shared/DropdownDynamic";
import NumberField from "../shared/NumberField";
import ModalFooterButtonPair from "../shared/ModalFooterButtonPair";


const CreateUnitModal = ({
    isOpenAdd,
    onCloseAdd
}) => {
    const [unitCode, setUnitCode] = useState('');
    const [unitName, setUnitName] = useState('');
    const [addDataOption, setAddDataOption] = React.useState('Add Now');
    const [unitYearOffering, setUnitYearOffering] = useState(new Date().getFullYear());
    const [unitSemesterOffering, setUnitSemesterOffering] = useState('');

    const navigate = useNavigate();
    const toast = useToast();

    const getToast = (title, status) => {
        toast.closeAll();
        toast(getToastSettings(title, status))
    }

    let authService = {
        "DEV": MockAuth,
        "TEST": useAuth0
    }
    const { getAccessTokenSilently } = authService[process.env.REACT_APP_AUTH]();

    const handleSubmitUnit = (event) => {
        event.preventDefault();
        const unitObject = {
            unitCode: unitCode,
            unitName: unitName,
            year: unitYearOffering,
            period: unitSemesterOffering
        };

        getAccessTokenSilently().then((token) => {
            fetch('http://localhost:8080/api/units/', {
                method: 'POST',
                headers: new Headers({
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }),
                body: JSON.stringify(unitObject),
            })
        });

        onCloseAdd();
        getToast('Unit created successfully', 'success');
        // fixme cause the nav modal to open here by setting state
    }

    return (
        <Modal closeOnOverlayClick={false} isOpen={isOpenAdd} onClose={onCloseAdd}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>New Unit</ModalHeader>
                <ModalCloseButton />
                <hr></hr>
                <ModalBody pb={10}>
                    <form id="create-unit" onSubmit={handleSubmitUnit}>
                        <br></br>
                        <FormControl isRequired>
                            <FormLabel>Unit code </FormLabel>
                            <Input
                                mb="5"
                                value={unitCode}
                                required
                                onChange={(event) => {
                                    setUnitCode(event.target.value);
                                }}
                            />

                            <FormLabel>Unit name</FormLabel>
                            <Input
                                mb="5"
                                value={unitName}
                                required
                                onChange={(event) => setUnitName(event.target.value)}
                            />

                            <FormLabel>Unit offering</FormLabel>
                            <Flex direction="row" spacing={4} justifyContent="space-between">
                                <NumberField
                                    defaultValue={unitYearOffering}
                                    minValue={new Date().getFullYear()}
                                    onChange={(event) => setUnitYearOffering(event)}
                                />
                                <DropdownDynamic
                                    placeholder={'select semester'}
                                    onChange={(event) => setUnitSemesterOffering(event.target.value)}
                                    options={['S1', 'S2', 'FY', 'Summer', 'Winter']}
                                />
                            </Flex>
                        </FormControl>
                    </form>
                </ModalBody>

                <ModalFooterButtonPair
                    cancelButtonColor="red"
                    cancelButtonOnClick={onCloseAdd}
                    cancelButtonText="Cancel"
                    confirmButtonColor="blue"
                    confirmButtonOnClick={handleSubmitUnit}
                    confirmButtonText="Create unit"
                />
            </ModalContent>
        </Modal>
    );
}

export default CreateUnitModal;