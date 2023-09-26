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
        console.log("adding unit")
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

        setTimeout(() => {
            if (addDataOption === "Add Later") {
                window.location.reload();
            }
            else {
                navigate(`/uploadData/${unitCode}/${unitYearOffering}/${unitSemesterOffering}`);
            }
        }, 1500)
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
                            <FormLabel>Unit Code </FormLabel>
                            <Input
                                mb="5"
                                value={unitCode}
                                onChange={(event) => {
                                    setUnitCode(event.target.value);
                                }}
                            />
                            <FormLabel>Unit Name</FormLabel>
                            <Input
                                mb="5"
                                value={unitName}
                                onChange={(event) => setUnitName(event.target.value)}
                            />
                            <FormLabel>Offering</FormLabel>

                            <Flex direction="row" spacing={4}>
                                <NumberInput allowMouseWheel size='md' defaultValue={unitYearOffering} min={new Date().getFullYear()} onChange={(event) => setUnitYearOffering(event)}>
                                    <NumberInputField />
                                    <NumberInputStepper>
                                        <NumberIncrementStepper />
                                        <NumberDecrementStepper />
                                    </NumberInputStepper>
                                </NumberInput>
                                <Select
                                    placeholder="Semester"
                                    value={unitSemesterOffering}
                                    onChange={(event) => setUnitSemesterOffering(event.target.value)}
                                >
                                    <option value="S1">Semester 1</option>
                                    <option value="S2">Semester 2</option>
                                    <option value="FY">Full Year</option>
                                    <option value="Summer">Summer</option>
                                    <option value="Winter">Winter</option>

                                </Select>
                            </Flex>
                            <Text>Add student data to your offering:</Text>
                            <Center>
                                <RadioGroup onChange={setAddDataOption} value={addDataOption}>
                                    <Stack direction='row'>
                                        <Radio value='Add Now'>Now</Radio>
                                        <Radio value='Add Later'>Later</Radio>
                                    </Stack>
                                </RadioGroup>
                            </Center>
                        </FormControl>
                    </form>
                </ModalBody>
                <ModalFooter>
                    <Button onClick={onCloseAdd} colorScheme="red" mr={3}>
                        Cancel
                    </Button>
                    <Button type="submit" colorScheme="blue" form="create-unit">
                        Create Unit
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}

export default CreateUnitModal;