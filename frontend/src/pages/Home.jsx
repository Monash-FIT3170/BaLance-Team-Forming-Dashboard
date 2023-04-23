import {
    Card, CardBody, CardHeader, CardFooter, Table, Icon,
    Text, Heading, Center, Spacer, HStack, Button, SimpleGrid,
    Modal, ModalBody,ModalOverlay,
    ModalContent,ModalHeader,ModalFooter,ModalCloseButton,
} from "@chakra-ui/react"

import {useDisclosure} from "@chakra-ui/react";
import NavBar from "../components/NavBar.jsx"

import React from 'react'
export default function CreatePopup(){
  
  const {isOpen, onOpen, onClose } = useDisclosure()
    return (
      <>
        <Button onClick={onOpen}>Unit Details</Button>
        <Modal closeOnOverlayClick={false} isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>FIT3077</ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
              DA BEST UNIT EVAHHH
            </ModalBody>
            <ModalFooter>
              <Button colorScheme='blue' mr={3} onClick={onClose}>
                Save
              </Button>
              <Button onClick={onClose}>Cancel</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </>
    )
}

function CreateHomePage(){
  return(
    <div>
        <NavBar />
        <SimpleGrid minChildWidth={300}>
          <Card border="1px" marginX="20px" marginBottom="20px">

          </Card>
        </SimpleGrid>
    </div>
  );
}


