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
} from "@chakra-ui/react";
import { useState, useEffect } from "react";

const CreateFormModal = ({ isModalOpen, onModalClose }) => {
  const [submitted, setSubmitted] = useState(false);
  const [formClosed, setFormClosed] = useState(false);


  const closeModal = () => {
    setSubmitted(false);
    onModalClose();
  };

  //Checkbox states
  const [formOptions, setFormOptions] = useState({
    Belbin: false,
    Effot: false,
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
    const forms = google.forms({version:'v1', auth: jwclient});

    //Create google form based on checkbox options
    const form = {

    //Belbin questions

    //Effort questions

    //Time preference questions
    }
    
    //Get students from unit
    event.preventDefault();
    setSubmitted(true);


    //Backend api call
  };

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