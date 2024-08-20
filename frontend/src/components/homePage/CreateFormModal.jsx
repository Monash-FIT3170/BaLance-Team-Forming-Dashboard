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
  const [timeLeft, setTimeLeft] = useState(15); // 15 sec timer
  const [formClosed, setFormClosed] = useState(false);

  useEffect(() => {
    let timer;

    if (isModalOpen) {
      setTimeLeft(15); // Reset timer back to the original time of 15 secs
      setFormClosed(false);
      timer = setInterval(() => {
        setTimeLeft(prevTime => {
          if (prevTime <= 1) {
            clearInterval(timer);
            setFormClosed(true); // Form closes if time is up
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    } else {
      clearInterval(timer);
    }

    return () => clearInterval(timer);
  }, [isModalOpen]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const closeModal = () => {
    setSubmitted(false);
    onModalClose();
  };

  const sendForm = (event) => {
    event.preventDefault();
    setSubmitted(true);
    setTimeLeft(0); // Stop the timer
  };

  const renderForm = () => (
    <form id="create-google-form" onSubmit={sendForm}>
      <FormControl isRequired>
        <Stack spacing={5} direction='column'>
          <Checkbox>Belbin</Checkbox>
          <Checkbox>Effort</Checkbox>
          <Checkbox>Time&Preference</Checkbox>
        </Stack>
      </FormControl>
      <Box position="relative">
          <Text position="absolute" top="10px" right="10px">
            Time left: {formatTime(timeLeft)}
          </Text>
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