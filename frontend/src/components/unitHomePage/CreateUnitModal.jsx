import {
    Flex,
    FormControl,
    FormLabel,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalHeader,
    ModalOverlay,
    Text,
    useToast, VStack
} from "@chakra-ui/react";
import {useState} from "react";
import getToastSettings from "../shared/ToastSettings";
import {MockAuth} from "../../helpers/mockAuth";
import {useAuth0} from "@auth0/auth0-react";
import DropdownDynamic from "../shared/DropdownDynamic";
import ModalFooterButtonPair from "../shared/ModalFooterButtonPair";
import TextField from "../shared/TextField";
import {useNavigate} from "react-router-dom";

const CreateUnitModal = ({
    isModalOpen,
    onModalClose
}) => {
    const [unitCode, setUnitCode] = useState('');
    const [unitName, setUnitName] = useState('');
    const [unitYear, setUnitYear] = useState(new Date().getFullYear());
    const [unitPeriod, setUnitPeriod] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const toast = useToast();
    const getToast = (title, status) => {
        toast.closeAll();
        toast(getToastSettings(title, status))
    }

    const navigate = useNavigate()

    let authService = {
        "DEV": MockAuth,
        "TEST": useAuth0
    }
    const { getAccessTokenSilently } = authService[process.env.REACT_APP_AUTH]();

    const submitUnit = (event) => {
        event.preventDefault();
        getAccessTokenSilently().then((token) => {
            fetch('http://localhost:8080/api/units/', {
                method: 'POST',
                headers: new Headers({
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }),
                body: JSON.stringify({
                    unitCode: unitCode,
                    unitName: unitName,
                    year: unitYear,
                    period: unitPeriod
                }),
            })
        });

        setSubmitted(true);
        getToast('Offering created successfully', 'success');
    }



    const renderForm = () => {
        return (
            <form id="create-unit" onSubmit={submitUnit}>
                <br/>
                <FormControl isRequired>
                    <TextField
                        label="Unit code"
                        value={unitCode}
                        onChange={(event) => {setUnitCode(event.target.value)}}
                    />
                    <TextField
                        label="Unit name"
                        value={unitName}
                        onChange={(event) => {setUnitName(event.target.value)}}
                    />

                    <Flex direction="row" spacing={4} justifyContent="space-between">
                        <VStack>
                            <FormLabel>Offering year</FormLabel>
                            <DropdownDynamic
                                placeholder={new Date().getFullYear()}
                                onChange={(event) => setUnitYear(event)}
                                options={[new Date().getFullYear()+1, new Date().getFullYear()+2, new Date().getFullYear()+3]}
                            />
                        </VStack>
                        <VStack>
                            <FormLabel>Offering period</FormLabel>
                            <DropdownDynamic
                                placeholder={'select semester'}
                                onChange={(event) => {setUnitPeriod(event.target.value)}}
                                options={['S1', 'S2', 'FY', 'Summer', 'Winter']}
                            />
                        </VStack>
                    </Flex>
                </FormControl>
            </form>
        )
    }


    return (
        <Modal closeOnOverlayClick={false} isOpen={isModalOpen} onClose={onModalClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>New Offering</ModalHeader>
                <ModalCloseButton />
                <hr/>

                <ModalBody pb={10}>
                    {!submitted ? renderForm() : <Text>Would you like to add student data to the offering?</Text>}
                </ModalBody>

                {!submitted ?
                    <ModalFooterButtonPair
                        cancelButtonColor="red"
                        cancelButtonOnClick={onModalClose}
                        cancelButtonText="Cancel"
                        confirmButtonColor="blue"
                        confirmButtonOnClick={submitUnit}
                        confirmButtonText="Create Offering"
                    />
                    :
                    <ModalFooterButtonPair
                        cancelButtonColor="red"
                        cancelButtonOnClick={() => {
                            onModalClose()
                            window.location.reload()
                        }}
                        cancelButtonText="Later"
                        confirmButtonColor="blue"
                        confirmButtonOnClick={() => navigate(`/uploadData/${unitCode}/${unitYear}/${unitPeriod}`)}
                        confirmButtonText="Confirm"
                    />
                }
            </ModalContent>
        </Modal>
    );
}

export default CreateUnitModal;