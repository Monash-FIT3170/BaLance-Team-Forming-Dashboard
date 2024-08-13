import {
  Checkbox,
  Flex,
  FormControl,
  FormLabel,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay, Stack,
  Text,
  useToast,
  VStack,
} from "@chakra-ui/react";
import {useState} from "react";
import ModalFooterButtonPair from "../_shared/ModalFooterButtonPair.jsx";

const CreateFormModal = ({ isModalOpen, onModalClose }) => {
  const [submitted, setSubmitted] = useState(false);

  const closeModal = () => {
    setSubmitted(false)
    onModalClose();
  };

  const sendForm = (event) => {
    setSubmitted(true);
  }

  const renderForm = () => {
    return (
      <form id="create-google-form" onSubmit={sendForm}>
        <br />
        <FormControl isRequired>
          <Stack spacing={5} direction='column'>
            <Checkbox>Belbin</Checkbox>
            <Checkbox>Preference</Checkbox>
          </Stack>
        </FormControl>
      </form>
    )
  }

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
          ) :(
            <Text>Sample text</Text>
          )}
        </ModalBody>

        {!submitted ? (
          <ModalFooterButtonPair
            cancelButtonColor="red"
            cancelButtonOnClick={closeModal}
            cancelButtonText="Cancel"
            confirmButtonColor="blue"
            confirmButtonText="Send Form"
          />
        ) : (
          <ModalFooterButtonPair
            cancelButtonColor="red"
            cancelButtonOnClick={() => {
              closeModal();
              window.location.reload();
            }}
            cancelButtonText="Later"
            confirmButtonColor="blue"
            confirmButtonText="Confirm"
          />
        )}

      </ModalContent>
    </Modal>
  );
};

export default CreateFormModal;