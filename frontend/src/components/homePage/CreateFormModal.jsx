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

  // Set checkbox values
  const [checkedItems, setCheckedItems] = useState([false, false, false]);

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
      `/api/forms/${unitCode}/${year}/${period}/create`,
      {
        method: 'POST',
        headers: new Headers({
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        }),
        body: JSON.stringify(
          checkedItems
      )
      }
    )
      .then((response) => {
        if (response.ok) {
          console.log("Send request for form creation");
        } else {
          return response.text().then((responseText) => {
            toast({
              title: 'Form Created',
              description: `Google form(s) for ${unitCode} have been successfully created`,
              status: 'success',
              duration: 4000,
              isClosable: true,
          });
          });
        }
      })
      .catch((error) => {
        console.error('Error sending data to the REST API:', error);
        // Optionally show an error message to the user.
      });
    },
    closeModal(),
    window.location.reload(),
  )};

  const renderForm = () => (
    <form id="create-google-form" onSubmit={sendForm}>
      <FormControl isRequired>
        <Stack spacing={5} direction='column'>
          <Checkbox
          name="Belbin"
          isChecked={checkedItems[0]}
          onChange={e => setCheckedItems([e.target.checked, checkedItems[1], checkedItems[2]])}>
            Belbin
          </Checkbox>

          <Checkbox
           name="Effort"
           isChecked={checkedItems[1]}
           onChange={e => setCheckedItems([checkedItems[0], e.target.checked, checkedItems[2]])}>
            Effort
          </Checkbox>

          <Checkbox
          name="TimeAndPref"
          isChecked={checkedItems[2]}
          onChange={e => setCheckedItems([checkedItems[0], checkedItems[1], e.target.checked])}>
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