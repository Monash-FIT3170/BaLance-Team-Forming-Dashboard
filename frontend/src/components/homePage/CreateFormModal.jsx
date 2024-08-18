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
  Button
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
      setFormClosed(false); // Forms opened again
      timer = setInterval(() => {
        setTimeLeft(prevTime => {
          if (prevTime <= 1) {
            clearInterval(timer);
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
    setFormClosed(true);
    onModalClose();
  };

  const sendForm = (event) => {
    event.preventDefault();
    setSubmitted(true);
  };

  const renderForm = () => (
    <form id="create-google-form" onSubmit={sendForm}>
      <FormControl isRequired>
        <Stack spacing={5} direction='column'>
          <Checkbox>Belbin</Checkbox>
          <Checkbox>Preference</Checkbox>
        </Stack>
      </FormControl>
      <Text mt={4}>Time left: {formatTime(timeLeft)}</Text>
    </form>
  );

  return (
    <Modal closeOnOverlayClick={false} isOpen={isModalOpen} onClose={closeModal}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>New Form</ModalHeader>
        <ModalCloseButton />
        <hr />

        <ModalBody pb={10}>
          {!submitted ? (
            renderForm()
          ) : (
            <Text>Success!</Text>
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