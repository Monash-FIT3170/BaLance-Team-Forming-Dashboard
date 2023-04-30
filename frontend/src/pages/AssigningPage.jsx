import React
 from "react";

 // Chakra imports
import {
  Flex,
  Button,
  Icon,
  Image,
  Text,
  useColorModeValue,
  Modal,
  ModalBody,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalCloseButton,
  useDisclosure,Select,
  Card, CardBody, CardHeader, CardFooter, Table,
    Thead,
    Tbody,
    Tfoot,
    Tr,
    Th,
    Td,
    TableCaption,
    TableContainer, SimpleGrid, Heading, Center, Spacer, HStack
} from "@chakra-ui/react";

import { MdFilterList  } from 'react-icons/md'
import { DragHandleIcon, CloseIcon, AddIcon, ArrowBackIcon } from '@chakra-ui/icons'

import NavBar from "../components/NavBar.jsx"

function AssigningPage(){

    let boxBg = useColorModeValue("white !important", "#111c44 !important");
    let mainText = useColorModeValue("gray.800", "white");
    let secondaryText = useColorModeValue("gray.600", "gray.600");
    let iconBox = useColorModeValue("gray.100", "whiteAlpha.200");
    let iconColor = useColorModeValue("brand.200", "white");
    const {isOpen, onOpen, onClose } = useDisclosure()

    return(
        <div>
            <Spacer></Spacer>
            <Button colorScheme='gray' variant='ghost'>
                <ArrowBackIcon boxSize={7}/>
            </Button>
            <Center margin="30px">
                <Heading>Assigning Page</Heading>
            </Center>
            <SimpleGrid minChildWidth="300">
                <Card border="1px" marginX="20px" marginBottom="20px">
                    <CardHeader>
                        <HStack>
                            <Heading>FIT3170: Software Engineering Practice</Heading>
                            <Spacer />
                            <Button colorScheme='gray' variant='ghost'>
                                <Icon as={MdFilterList}></Icon>Filter
                            </Button>
                        </HStack>

                    </CardHeader>

                    <CardBody margin="15px">
                        <TableContainer>
                            <Table variant='striped'>
                                <Thead>
                                    <Tr>
                                        <Th></Th>
                                        <Th>Name</Th>
                                        <Th>Email Address</Th>
                                        <Th>Lab Number</Th>
                                        <Th>Status</Th>
                                    </Tr>
                                </Thead>
                                <Tbody>
                                    <Tr>
                                        <Td>
                                            <HStack>
                                                <button><CloseIcon /></button>
                                                <Spacer />
                                                <button><DragHandleIcon /></button>
                                            </HStack>
                                        </Td>
                                        <Td>teacher1</Td>
                                        <Td>aaa0000@student.monash.edu</Td>
                                        <Td>
                                            <Select placeholder='Select option'>
                                                <option value='option1'>01</option>
                                                <option value='option2'>02</option>
                                                <option value='option3'>03</option>
                                            </Select>
                                        </Td>
                                        <Td>
                                            <Select placeholder='Select option'>
                                                <option value='option1'>Admin</option>
                                                <option value='option2'>TA 2</option>
                                                <option value='option3'>Guest/something else</option>
                                            </Select>
                                        </Td>
                                    </Tr>
                                    <Tr>
                                        <Td>
                                            <HStack>
                                                <button><CloseIcon /></button>
                                                <Spacer />
                                                <button><DragHandleIcon /></button>
                                            </HStack>
                                        </Td>
                                        <Td>teacher2</Td>
                                        <Td>aaa0001@student.monash.edu</Td>
                                        <Td>
                                            <Select placeholder='Select option'>
                                                <option value='option1'>01</option>
                                                <option value='option2'>02</option>
                                                <option value='option3'>03</option>
                                            </Select>
                                        </Td>
                                        <Td>
                                            <Select placeholder='Select option'>
                                                <option value='option1'>Admin</option>
                                                <option value='option2'>TA 2</option>
                                                <option value='option3'>Guest/something else</option>
                                            </Select>
                                        </Td>
                                    </Tr>
                                    <Tr>
                                        <Td>
                                            <HStack>
                                                <button><CloseIcon /></button>
                                                <Spacer />
                                                <button><DragHandleIcon /></button>
                                            </HStack>
                                        </Td>
                                        <Td>teacher3</Td>
                                        <Td>aaa0002@student.monash.edu</Td>
                                        <Td>
                                            <Select placeholder='Select option'>
                                                <option value='option1'>01</option>
                                                <option value='option2'>02</option>
                                                <option value='option3'>03</option>
                                            </Select>
                                        </Td>
                                        <Td>
                                            <Select placeholder='Select option'>
                                                <option value='option1'>Admin</option>
                                                <option value='option2'>TA 2</option>
                                                <option value='option3'>Guest/something else</option>
                                            </Select>
                                        </Td>
                                    </Tr>
                                    <Tr>
                                        <Td>
                                            <HStack>
                                                <button><CloseIcon /></button>
                                                <Spacer />
                                                <button><DragHandleIcon /></button>
                                            </HStack>
                                        </Td>
                                        <Td>teacher4</Td>
                                        <Td>aaa0003@student.monash.edu</Td>
                                        <Td>
                                            <Select placeholder='Select option'>
                                                <option value='option1'>01</option>
                                                <option value='option2'>02</option>
                                                <option value='option3'>03</option>
                                            </Select>
                                        </Td>
                                        <Td>
                                            <Select placeholder='Select option'>
                                                <option value='option1'>Admin</option>
                                                <option value='option2'>TA 2</option>
                                                <option value='option3'>Guest/something else</option>
                                            </Select>
                                        </Td>
                                    </Tr>
                                    <Tr>
                                        <Td colspan="7">
                                            <Center>
                                                <button><AddIcon /></button>
                                            </Center>
                                        </Td>

                                    </Tr>
                                </Tbody>
                            </Table>
                        </TableContainer>
                    </CardBody>
                </Card>

            </SimpleGrid>
        </div>
    )
}

export default AssigningPage;