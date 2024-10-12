import { useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { MockAuth } from '../../helpers/mockAuth';
import { useParams } from 'react-router';

import {
  Checkbox,
  Flex,
  FormControl,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
  Button,
  Box,
  useToast
} from "@chakra-ui/react";

const CreateFormModal = ({ isModalOpen, onModalClose }) => {
  
  let authService = {
    DEV: MockAuth,
    TEST: useAuth0,
  };

  const toast = useToast();
  const [submitted, setSubmitted] = useState(false);
  const [formClosed, setFormClosed] = useState(false);
  const { getAccessTokenSilently } = authService[import.meta.env.VITE_REACT_APP_AUTH]();
  const { unitCode, year, period } = useParams();

  const closeModal = () => {
    setSubmitted(false);
    onModalClose();
  };

  //Checkbox states
  const [formOptions, setFormOptions] = useState({
    Belbin: false,
    Effort: false,
    TimeAndPref: false
  });

  //Changes checkbox state for form creation
  const handleCheckboxChange = (event) => {
    const { name, checked } = event.target;
    setFormOptions((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  const sendForm = (event) => {
    // const forms = google.forms({version:'v1', auth: jwclient});

    // //Create google form based on checkbox options
    // const form = {

    // //Belbin questions

    // //Effort questions

    // //Time preference questions
    // }

    //Get students from unit
    // event.preventDefault();
    // setSubmitted(true);


    //Backend api call

    getAccessTokenSilently().then((token) => {
      
      fetch(
      `/api/forms/${unitCode}/${year}/${period}/`,
      {
        method: 'POST',
        headers: new Headers({
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        }),
        body: JSON.stringify({
          formOptions
      })
        // body: JSON.stringify({students: data.students, testType: data.testType}),
      }
    )
      .then((response) => {
        if (response.ok) {
          console.log("Send request for form creation");
        } else {
          return response.text().then((responseText) => {
            console.log("Retrieved response for form creation")
          });
        }
      })
      .catch((error) => {
        console.error('Error sending data to the REST API:', error);
        // Optionally show an error message to the user.
      });

      toast({
        title: 'Form Created',
        description: `Google form(s) for ${unitCode} have been successfully created`,
        status: 'success',
        duration: 4000,
        isClosable: true,
    });
    },
    closeModal(),
  )};

  const renderForm = () => (
    <form id="create-google-form" onSubmit={sendForm}>
      <FormControl isRequired>
        <Stack spacing={5} direction='column'>
          <Checkbox
          name="Belbin"
          isChecked={formOptions.Belbin}
          onChange={handleCheckboxChange}>
          
            Belbin
          </Checkbox>

          <Checkbox
           name="Effort"
           isChecked={formOptions.Effort}
           onChange={handleCheckboxChange}>
            Effort
          </Checkbox>

          <Checkbox
          name="TimeAndPreference"
          isChecked={formOptions.TimeAndPreference}
          onChange={handleCheckboxChange}>
            Time & Preference
          </Checkbox>
        </Stack>
      </FormControl>
      <Box position="relative">
        </Box>
    </form>
  );

  return (
    <Modal closeOnOverlayClick={false} isOpen={isModalOpen} onClose={closeModal}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader textAlign="center">New Form</ModalHeader>
        <ModalCloseButton />
        <hr />

        <ModalBody pb={10}>
          {formClosed && !submitted ? (
            <Flex justify="center" align="center" height="100px">
              <Text fontSize="2xl">
                Your session has expired.
              </Text>
            </Flex>
          ):!submitted? (
            renderForm()
          ) : (
            <Text>Blank</Text>
          )}
        </ModalBody>

        <Flex justify="space-between" p={4}>
          {!submitted && !formClosed ? (
            <>
              <Button colorScheme="red" onClick={closeModal}>Close</Button>
              <Button colorScheme="blue" onClick={sendForm}>Create Form</Button>
            </>
          ) : (
            <Button colorScheme="blue" onClick={() => {
              closeModal();
              window.location.reload();
            }}>Confirm</Button>
          )}
        </Flex>
      </ModalContent>
    </Modal>
  );
};

export default CreateFormModal;