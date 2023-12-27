import { useAuth0 } from "@auth0/auth0-react";
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalCloseButton,
    useToast
} from '@chakra-ui/react'

import { MockAuth } from "../../helpers/mockAuth";
import ModalFooterButtonPair from "../_shared/ModalFooterButtonPair";
import getToastSettings from "../_shared/ToastSettings";


const DeleteModal = ({
    modalHeader,
    modalText,
    apiEndpoint,
    isOpen,
    onClose
}) => {

    let authService = {
        DEV: MockAuth,
        TEST: useAuth0,
    };

    const { getAccessTokenSilently } = authService[process.env.REACT_APP_AUTH]();

    const toast = useToast();
    const getToast = (title, status) => {
        toast.closeAll();
        toast(getToastSettings(title, status));
    };

    const handleDeletion = () => {
        getAccessTokenSilently().then((token) => {
            fetch(
                apiEndpoint, {
                    method: 'DELETE',
                    headers: new Headers({
                        Authorization: `Bearer ${token}`
                    })
                }
            );

            // todo error handling

            getToast('Unit deleted successfully', 'success');
            setTimeout(() => {
                onClose();
                window.location.reload();
            }, 1500);
        });
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>{modalHeader}</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    {modalText}
                </ModalBody>

                <ModalFooterButtonPair
                    cancelButtonText='cancel'
                    cancelButtonColor='red'
                    cancelButtonOnClick={onClose}
                    confirmButtonText='delete'
                    confirmButtonColor='blue'
                    confirmButtonOnClick={handleDeletion}
                />
            </ModalContent>
        </Modal>
    )
}

export default DeleteModal;
