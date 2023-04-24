import React from "react";
// Chakra imports
import {
  Flex,
  Button,
  Icon,
  Image,
  Text,
  useColorModeValue,
  Card, 
  SimpleGrid,
  Modal,
  ModalBody,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalCloseButton,
  useDisclosure
} from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";
import { Center, Heading } from "@chakra-ui/react"
import { IoEllipsisHorizontalSharp,IoTrashOutline } from "react-icons/io5";
import NavBar from "../components/NavBar.jsx"

function UnitPage() {
  let boxBg = useColorModeValue("white !important", "#111c44 !important");
  let mainText = useColorModeValue("gray.800", "white");
  let secondaryText = useColorModeValue("gray.600", "gray.600");
  let iconBox = useColorModeValue("gray.100", "whiteAlpha.200");
  let iconColor = useColorModeValue("brand.200", "white");
  const {isOpen, onOpen, onClose } = useDisclosure()
  return(
    <div>
      <NavBar />
        <Center margin="40px">
          <Heading>Unit Home Page</Heading>
          <Flex>
          <Button
              w='40px'
              h='40px'
              align='right'
              justify='right'
              borderRadius='12px'
              me='12px'
              onClick={onOpen}>
                <Icon
                w='24px'
                h ='24px'
                as={AddIcon}
                color={iconColor}
                />
              
            </Button>
            </Flex>
          <br />
        </Center>

        <Flex 
        borderRadius='20px'
        bg={boxBg}
        p='20px'
        h='345px'
        w={{ base: "315px", md: "345px" }}
        alignItems='center'
        direction='column'>  
        <Flex w='100%' mb='18px'>
          <Flex
            w='20px'
            h='40px'
            align='left'
            justify='left'
            borderRadius='20%'
            borderColor='black'
            me='12px'>
          </Flex>
            <Text
              my='auto'
              fontWeight='800'
                
              color={mainText}
              textAlign='center'
              fontSize='xl'
              me='auto'>
                <Button style={{fontWeight: 'bold', fontSize: '20px'}}>FIT3170</Button>
              
            </Text>
            
            <Button
              w='38px'
              h='38px'
              align='right'
              justify='right'
              borderRadius='12px'
              me='12px'
              bg={iconBox}
              onClick={onOpen}>
                <Icon
                w='24px'
                h ='24px'
                as={IoEllipsisHorizontalSharp}
                color={iconColor}
                />
              
            </Button>
            <Modal closeOnOverlayClick={false} isOpen={isOpen} onClose={onClose}>
              <ModalOverlay />
              <ModalContent>
                <ModalHeader>FIT3170</ModalHeader>
                <ModalCloseButton />
                <ModalBody pb={6}>
                  150 Students enrrolled
                </ModalBody>
                <ModalFooter>
                  <Text
                    my='auto'
                    fontWeight='800'
                      
                    color={mainText}
                    textAlign='left'
                    fontSize='xl'
                    me='auto'>
                      <Button style={{ fontSize: '20px'}}>Edit</Button>
                    
                  </Text>
                  <Button colorScheme='blue' mr={3} onClick={onClose}>
                    Save
                  </Button>
                  <Button onClick={onClose}>Cancel</Button>
                </ModalFooter>
              </ModalContent>
            </Modal>
        </Flex>
        <Image
        src='https://img.freepik.com/free-vector/gradient-purple-color-gradient-background-abstract-modern_343694-2243.jpg?w=740&t=st=1682246391~exp=1682246991~hmac=24a5e0adc73d36b09e5b9fc4b2b05aabd12bab82078f67b6556cb3800ca6d1e4'
        style={{ height: '30%', width: '80%', display: 'flex', justifyContent: 'center'}}
        borderRadius='20px'
        mb='10px'/>
        <Text
        fontWeight='600'
        color={secondaryText}
        textAlign='center'
        fontSize='l'
        w='80%'>
        Software Engineering Practice
      </Text>
      </Flex>
    </div>
  )
}


export default UnitPage;