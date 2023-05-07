import React, { useState } from "react";
import createUnitGroups from './DisplayUnitGroups'
import { BrowserRouter, Routes, Route,Switch } from 'react-router-dom'

// Chakra imports
import {
  Link,
  Flex,
  Button,
  Icon,
  Image,
  Text,
  Modal,
  ModalBody,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalCloseButton,
  useColorModeValue,
  useDisclosure,
  FormControl,
  FormLabel,
  Input,
  Select,
  FormErrorMessage
} from "@chakra-ui/react";
import { PlusSquareIcon, EditIcon } from "@chakra-ui/icons";
import { Center, Heading } from "@chakra-ui/react"
import { IoEllipsisHorizontalSharp,IoTrashOutline } from "react-icons/io5";
import NavBar from "../components/NavBar.jsx"



function UnitPage() {
  let boxBg = useColorModeValue("white !important", "#111c44 !important");
  let mainText = useColorModeValue("gray.800", "white");
  let secondaryText = useColorModeValue("gray.600", "gray.600");
  let iconBox = useColorModeValue("gray.100", "whiteAlpha.200");
  let iconColor = useColorModeValue("brand.200", "white");
  const {isOpen: isOpenDetails, onOpen: onOpenDetails, onClose: onCloseDetails } = useDisclosure()
  const {isOpen: isOpenAdd, onOpen: onOpenAdd, onClose: onCloseAdd } = useDisclosure()
  const [unitNameError, setUnitNameError] = useState(false);

  return(
    <div>
        <Center margin="40px">
          <Heading>Unit Home Page</Heading>
          <Button
                w='40px'
                h='40px'
                align='right'
                justify='right'
                borderRadius='12px'
                style={{position: 'absolute', top: 135, right: 10}}
                me='12px'>
                  <Icon
                  w='50px'
                  h ='30px'
                  as={PlusSquareIcon}
                  color={iconColor}
                  onClick={onOpenAdd}/>
          </Button>
          <Modal closeOnOverlayClick={false} isOpen={isOpenAdd} onClose={onCloseAdd}>
              <ModalOverlay />
              <ModalContent>
                <ModalHeader>New Unit</ModalHeader>
                <ModalCloseButton />
                <ModalBody pb={10}>
                  <form 
                  id='create-unit'
                  onSubmit={
                    (event) => {
                      event.preventDefault();
                      alert("Unit created successfully")
                  }}>
                    <FormControl isRequired>
                      <FormLabel>Unit Code </FormLabel>
                      <Input mb='5'/>                     
                      <FormLabel>Unit Name</FormLabel>
                      <Input mb='5'/>                     
                      <FormLabel>Students Per Team</FormLabel>
                        <Select placeholder="Select an option"
                          placeholderStyles={{ fontStyle: "italic" }}
                          placeholderTextColor="gray.500"
                          width='50%'>
                          <option value="1">2</option>
                          <option value="1">3</option>
                          <option value="1">4</option>
                        </Select>                      
                    </FormControl>
                  </form>
                </ModalBody>
                <ModalFooter>
                  <Button onClick={onCloseAdd} colorScheme='red' mr={3}>Cancel</Button>
                  <Button type='submit' colorScheme='green' onClick={onCloseAdd} form='create-unit'>
                    Create Unit
                  </Button>
                </ModalFooter>
              </ModalContent>
            </Modal>
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
              onClick={onOpenDetails}>
                <Icon
                w='24px'
                h ='24px'
                as={IoEllipsisHorizontalSharp}
                color={iconColor}
                />
              
            </Button>
            <Modal closeOnOverlayClick={false} isOpen={isOpenDetails} onClose={onCloseDetails} onClick={<Link to={this} onClick={isOpenDetails}>'./DisplayUnitGroups'</Link>}>
              <ModalOverlay />
              <ModalContent>
                <ModalHeader>FIT3170</ModalHeader>
                <ModalCloseButton />
                <ModalBody pb={6}>
                  150 Students enrolled
                </ModalBody>
                <ModalFooter>
                  <Text
                    my='auto'
                    fontWeight='800'
                      
                    color={mainText}
                    textAlign='left'
                    fontSize='xl'
                    me='auto'>
                      <Button> <Icon as={EditIcon}></Icon> </Button>

                    
                  </Text>
                  <Button onClick={onCloseDetails} mr={3}>Cancel</Button>
                  <Button colorScheme='blue' onClick={onCloseDetails}>
                    Save
                  </Button>
                </ModalFooter>
              </ModalContent>
            </Modal>
        </Flex>
        <Button style={{ display: 'inline-block', width: 'auto', height: 'auto' }}  >
          <Image
          src='https://img.freepik.com/free-vector/gradient-purple-color-gradient-background-abstract-modern_343694-2243.jpg?w=740&t=st=1682246391~exp=1682246991~hmac=24a5e0adc73d36b09e5b9fc4b2b05aabd12bab82078f67b6556cb3800ca6d1e4'
          style={{ height: '60%', width: '100%', display: 'flex', justifyContent: 'center'}}
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
        </Button>
      </Flex>
    </div>
  )
}




export default UnitPage;