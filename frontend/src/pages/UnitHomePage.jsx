import React, { useState } from "react";
import createUnitGroups from './DisplayUnitGroups'
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom'
import UnitCard from "../components/UnitCard"
import "../pages/UnitHomePage.css"

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
  FormErrorMessage,
  Container
} from "@chakra-ui/react";
import { PlusSquareIcon, EditIcon } from "@chakra-ui/icons";
import { Center, Heading } from "@chakra-ui/react"
import { IoEllipsisHorizontalSharp,IoTrashOutline } from "react-icons/io5";
import NavBar from "../components/NavBar.jsx"

const units = []
const eng1003 = {
	"unitId": "ENG1003",
  "unitName":"Engineering Mobile Apps",
	"unitFaculty": "Engineering",
	"labs": ["001", "002", "003"],
	"teachers": ["EvanSmith@teacher.monash.edu", "JaneDoe@teacher.monash.edu"]
}
const eng1005 = {
	"unitId": "ENG1005",
  "unitName":"Engineering Mathematics",
	"unitFaculty": "Engineering",
	"labs": ["001", "002", "003"],
	"teachers": ["EvanSmith@teacher.monash.edu", "JaneDoe@teacher.monash.edu"]
}
const eng1001 = {
	"unitId": "ENG1001",
  "unitName":"The civil stuff",
	"unitFaculty": "Engineering",
	"labs": ["001", "002", "003"],
	"teachers": ["EvanSmith@teacher.monash.edu", "JaneDoe@teacher.monash.edu"]
}
const eng1002 = {
	"unitId": "ENG1002",
  "unitName":"The electrical stuff",
	"unitFaculty": "Engineering",
	"labs": ["001", "002", "003"],
	"teachers": ["EvanSmith@teacher.monash.edu", "JaneDoe@teacher.monash.edu"]
}
units.push(eng1003)
units.push(eng1005)
units.push(eng1001)
units.push(eng1002)




function UnitPage() {
  let boxBg = useColorModeValue("white !important", "#111c44 !important");
  let mainText = useColorModeValue("gray.800", "white");
  let secondaryText = useColorModeValue("gray.600", "gray.600");
  let iconBox = useColorModeValue("gray.100", "whiteAlpha.200");
  let iconColor = useColorModeValue("brand.200", "white");
  const {isOpen: isOpenDetails, onOpen: onOpenDetails, onClose: onCloseDetails } = useDisclosure()
  const {isOpen: isOpenAdd, onOpen: onOpenAdd, onClose: onCloseAdd } = useDisclosure()
  const [unitNameError, setUnitNameError] = useState(false);

  // setting up navigation
  const navigate = useNavigate();

  const handleUnitClick = () => {
    navigate('/groups');
  };

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
                <hr></hr>
                <ModalBody pb={10}>
                  <form 
                  id='create-unit'
                  onSubmit={
                    (event) => {
                      event.preventDefault();
                      let answer = window.confirm("Unit created successfully");    
                      if (answer){
                        onCloseAdd();
                      }           
                  }}>
                    <br></br>
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
                  <Button type='submit' colorScheme='green' form='create-unit'>
                    Create Unit
                  </Button>
                </ModalFooter>
              </ModalContent>
            </Modal>
        </Center>
        
        
      <Container className="units" maxW="80vw">
        {units.map((unit) => (
          <UnitCard unit={unit} key={unit.unitId} className="unit" />
        ))}
      </Container>
    </div>
  )
}




export default UnitPage;