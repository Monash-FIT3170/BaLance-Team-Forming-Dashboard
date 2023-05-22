
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
    Container,
    Spacer
  } from "@chakra-ui/react";
  import { AddIcon,EditIcon } from '@chakra-ui/icons'
  import { IoEllipsisHorizontalSharp,IoTrashOutline } from "react-icons/io5";
  import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom'


const UnitCard = (unit) => {

    let boxBg = useColorModeValue("white !important", "#111c44 !important");
    let mainText = useColorModeValue("gray.800", "white");
    let secondaryText = useColorModeValue("gray.600", "gray.600");
    let iconBox = useColorModeValue("gray.100", "whiteAlpha.200");
    let iconColor = useColorModeValue("brand.200", "white");
    const {isOpen: isOpenDetails, onOpen: onOpenDetails, onClose: onCloseDetails } = useDisclosure()


    const unitCode  = unit.unitCode 
    const unitName = unit.unitFaculty

    const navigate = useNavigate();

    const handleUnitClick = () => {
        navigate('/groups/' + unitCode);
      };
    return (
        <Flex 
        borderRadius='20px'
        bg={boxBg}
        p='20px'
        h='345px'
        w={{ base: "345px", md: "375px" }}
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
                <Button onClick={handleUnitClick} style={{fontWeight: 'bold', fontSize: '20px'}}>{unitCode}</Button>
            </Text>
            <Spacer />
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
        <Button onClick={handleUnitClick} style={{ display: 'inline-block', width: 'auto', height: 'auto' }}  >
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
          {unitName}
          </Text>
        </Button>
      </Flex>
    )
}
export default UnitCard