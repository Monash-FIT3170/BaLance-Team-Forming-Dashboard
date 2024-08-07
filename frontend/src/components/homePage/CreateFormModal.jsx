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
  VStack,
} from "@chakra-ui/react";

const CreateFormModal = ({ isModalOpen, onModalClose }) => {

  const closeModal = () => {
    onModalClose();
  };

  return (
    <Modal isOpen={isModalOpen} onClose={closeModal}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>New Form</ModalHeader>
        <ModalCloseButton />
        <hr />

      </ModalContent>
    </Modal>
  );
};

export default CreateFormModal;