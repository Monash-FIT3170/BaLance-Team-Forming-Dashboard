import { useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";
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
    useToast,
    VStack
} from "@chakra-ui/react";

import { MockAuth } from "../../helpers/mockAuth";
import Dropdown from "../_shared/Dropdown";
import ModalFooterButtonPair from "../_shared/ModalFooterButtonPair";
import TextField from "../_shared/TextField";

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
    const navigate = useNavigate()

    let authService = {
        "DEV": MockAuth,
        "TEST": useAuth0
    }

    const { getAccessTokenSilently } = authService[process.env.REACT_APP_AUTH]();
    const colors = ['red', 'orange', 'purple', 'green', 'blue', 'purple', 'black', 'yellow']
    const randIdxGen = Math.floor(Math.random() * colors.length)

    const closeModal = () => {
        setUnitCode('');
        setUnitName('');
        setUnitYear(new Date().getFullYear());
        setUnitPeriod('');
        setSubmitted(false)
        onModalClose()
    }

    const validateFields = () => {
        const errors = []

        if (unitCode === '') {
            errors.push('unit code must be provided')
        } else if (unitCode.search(/^[A-Za-z0-9]{1,7}$/) === -1) {
            errors.push('unit code must consist of letters and/or numbers only and cannot exceed 7 characters')
        }

        if (unitName === '') {
            errors.push('unit name must be provided')
        } else if (unitName.search(/^[A-Za-z0-9\s]{1,50}$/) === -1) {
            errors.push('unit name must consist of letters and/or numbers only and cannot exceed 50 characters')
        }

        if (unitYear.toString() === '') {
            errors.push('year must be provided')
        }

        if (unitPeriod === '') {
            errors.push('period must be provided')
        }

        return errors
    }

    const submitUnit = (event) => {
        event.preventDefault();
        const errors = validateFields()

        if (errors.length > 0) {
            errors.forEach((errorMsg) =>
                toast({
                    title: 'Input error',
                    description: errorMsg,
                    status: 'error',
                    duration: 4000,
                    isClosable: true,
                })
            )
            return
        }

        getAccessTokenSilently()
            .then((token) => {
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
                        period: unitPeriod,
                        color: colors[randIdxGen]
                    }),
                })
            })
            .then()
            .catch()

        toast({
            title: 'Unit created',
            description: `Unit ${unitCode} has been successfully created`,
            status: 'success',
            duration: 4000,
            isClosable: true,
        })

        setSubmitted(true);
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
                            <Dropdown
                                placeholder={(new Date().getFullYear()).toString()}
                                onChange={(event) => setUnitYear(event.target.value)}
                                options={[
                                    (new Date().getFullYear()+1).toString(),
                                    (new Date().getFullYear()+2).toString(),
                                    (new Date().getFullYear()+3).toString()
                                ]}
                            />
                        </VStack>
                        <VStack>
                            <FormLabel>Offering period</FormLabel>
                            <Dropdown
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
        <Modal closeOnOverlayClick={false} isOpen={isModalOpen} onClose={closeModal}>
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
                        cancelButtonOnClick={closeModal}
                        cancelButtonText="Cancel"
                        confirmButtonColor="blue"
                        confirmButtonOnClick={submitUnit}
                        confirmButtonText="Create Offering"
                    />
                    :
                    <ModalFooterButtonPair
                        cancelButtonColor="red"
                        cancelButtonOnClick={() => {
                            closeModal()
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