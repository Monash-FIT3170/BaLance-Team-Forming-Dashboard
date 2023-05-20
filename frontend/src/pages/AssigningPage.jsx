import {React, useState}
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
  Input,
  useDisclosure,Select,
  Card, CardBody, CardHeader, CardFooter, Table,
    Thead,
    Tbody,
    Tfoot,
    Tr,
    Th,
    Td,
    TableCaption,
    TableContainer, SimpleGrid, Heading, Center, Spacer, HStack,
    Checkbox, CheckboxGroup,
    Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuItemOption,
  MenuGroup,
  MenuOptionGroup,
  MenuDivider,
  Box
} from "@chakra-ui/react";

import { MdFilterList  } from 'react-icons/md'
import { DragHandleIcon, CloseIcon, AddIcon, ArrowBackIcon,ChevronDownIcon  } from '@chakra-ui/icons'


function AssigningPage(){

    let boxBg = useColorModeValue("white !important", "#111c44 !important");
    let mainText = useColorModeValue("gray.800", "white");
    let secondaryText = useColorModeValue("gray.600", "gray.600");
    let iconBox = useColorModeValue("gray.100", "whiteAlpha.200");
    let iconColor = useColorModeValue("brand.200", "white");
    const {isOpen, onOpen, onClose } = useDisclosure()


    const [isChecked1, setIsChecked1] = useState(false);
    const [isChecked2, setIsChecked2] = useState(false);
    const [checkedValues1, setCheckedValues1] = useState([]);
    const [checkedValues2, setCheckedValues2] = useState([]);
    const [checkedValues3, setCheckedValues3] = useState([]);
    const [checkedValues4, setCheckedValues4] = useState([]);
    
    function handleCheckboxChange1(values) {
        setCheckedValues1(values);
    }
    function handleCheckboxChange2(values) {
        setCheckedValues2(values);
    }
    function handleCheckboxChange3(values) {
        setCheckedValues3(values);
    }
    function handleCheckboxChange4(values) {
        setCheckedValues4(values);
    }

   


    return(
        <div>
            {/* <Spacer></Spacer>
            <Button colorScheme='gray' variant='ghost'>
                <ArrowBackIcon boxSize={7}/>
            </Button> */}
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
                        <Spacer/>
                        <Input placeholder='search' />

                    </CardHeader>

                    <CardBody margin="15px">
                        <TableContainer>
                            <Table variant='striped' size='md'>
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
                                        <Td>aaa0000@staff.monash.edu</Td>
                                        <Td>
                                            <SimpleGrid columns={{ sm: 1, md: 2, lg: 3 }} spacing="10px">
                                                {checkedValues1.map((card, index) => (
                                                    <Box key={index} boxShadow="md" rounded="md" p="1">
                                                    <Text fontSize="s">{card}</Text>
                                                    </Box>
                                                ))}
                                            </SimpleGrid>
                                            <br/> 
                                            <Menu>
                                                <MenuButton px={4}
                                                            py={2}
                                                            transition='all 0.2s'
                                                            borderRadius='md'
                                                            borderWidth='1px'
                                                            _hover={{ bg: 'gray.400' }}
                                                            _expanded={{ bg: 'blue.400' }}
                                                            _focus={{ boxShadow: 'outline' }}>Labs <ChevronDownIcon /></MenuButton>
                                                <MenuList>
                                                    <MenuOptionGroup
                                                    type="checkbox"
                                                    value={checkedValues1}
                                                    onChange={handleCheckboxChange1}
                                                    >
                                                    <MenuItemOption value="lab1">Lab 1</MenuItemOption>
                                                    <MenuItemOption value="lab2">Lab 2</MenuItemOption>
                                                    <MenuItemOption value="lab3">Lab 3</MenuItemOption>
                                                    </MenuOptionGroup>
                                                </MenuList>
                                            </Menu>
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
                                        <Td>aaa0001@staff.monash.edu</Td>
                                        <Td>
                                            <SimpleGrid columns={{ sm: 1, md: 2, lg: 3 }} spacing="10px">
                                                {checkedValues2.map((card, index) => (
                                                    <Box key={index} boxShadow="md" rounded="md" p="1">
                                                    <Text fontSize="s">{card}</Text>
                                                    </Box>
                                                ))}
                                            </SimpleGrid>
                                            <br/>
                                            <Menu>
                                                <MenuButton px={4}
                                                                py={2}
                                                                transition='all 0.2s'
                                                                borderRadius='md'
                                                                borderWidth='1px'
                                                                _hover={{ bg: 'gray.400' }}
                                                                _expanded={{ bg: 'blue.400' }}
                                                                _focus={{ boxShadow: 'outline' }}>Labs <ChevronDownIcon /></MenuButton>
                                                <MenuList>
                                                    <MenuOptionGroup
                                                    type="checkbox"
                                                    value={checkedValues2}
                                                    onChange={handleCheckboxChange2}
                                                    >
                                                    <MenuItemOption value="lab1">Lab 1</MenuItemOption>
                                                    <MenuItemOption value="lab2">Lab 2</MenuItemOption>
                                                    <MenuItemOption value="lab3">Lab 3</MenuItemOption>
                                                    </MenuOptionGroup>
                                                </MenuList>
                                            </Menu>
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
                                        <Td>aaa0002@staff.monash.edu</Td>
                                        <Td>
                                            <SimpleGrid columns={{ sm: 1, md: 2, lg: 3 }} spacing="10px">
                                                {checkedValues3.map((card, index) => (
                                                    <Box key={index} boxShadow="md" rounded="md" p="1">
                                                    <Text fontSize="s">{card}</Text>
                                                    </Box>
                                                ))}
                                            </SimpleGrid>
                                            <br/>
                                            <Menu>
                                                <MenuButton px={4}
                                                            py={2}
                                                            transition='all 0.2s'
                                                            borderRadius='md'
                                                            borderWidth='1px'
                                                            _hover={{ bg: 'gray.400' }}
                                                            _expanded={{ bg: 'blue.400' }}
                                                            _focus={{ boxShadow: 'outline' }}>Labs <ChevronDownIcon /></MenuButton>
                                                <MenuList>
                                                    <MenuOptionGroup
                                                    type="checkbox"
                                                    value={checkedValues3}
                                                    onChange={handleCheckboxChange3}
                                                    >
                                                    <MenuItemOption value="lab1">Lab 1</MenuItemOption>
                                                    <MenuItemOption value="lab2">Lab 2</MenuItemOption>
                                                    <MenuItemOption value="lab3">Lab 3</MenuItemOption>
                                                    </MenuOptionGroup>
                                                </MenuList>
                                            </Menu>
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
                                        <Td>aaa0003@staff.monash.edu</Td>
                                        <Td>
                                            <SimpleGrid columns={{ sm: 1, md: 2, lg: 3 }} spacing="10px">
                                                {checkedValues4.map((card, index) => (
                                                    <Box key={index} boxShadow="md" rounded="md" p="1">
                                                    <Text fontSize="s">{card}</Text>
                                                    </Box>
                                                ))}
                                            </SimpleGrid>
                                            <br/>
                                            <Menu>
                                                <MenuButton px={4}
                                                            py={2}
                                                            transition='all 0.2s'
                                                            borderRadius='md'
                                                            borderWidth='1px'
                                                            _hover={{ bg: 'gray.400' }}
                                                            _expanded={{ bg: 'blue.400' }}
                                                            _focus={{ boxShadow: 'outline' }}>Labs <ChevronDownIcon /></MenuButton>
                                                <MenuList>
                                                    <MenuOptionGroup
                                                    type="checkbox"
                                                    value={checkedValues4}
                                                    onChange={handleCheckboxChange4}
                                                    >
                                                    <MenuItemOption value="lab1">Lab 1</MenuItemOption>
                                                    <MenuItemOption value="lab2">Lab 2</MenuItemOption>
                                                    <MenuItemOption value="lab3">Lab 3</MenuItemOption>
                                                    </MenuOptionGroup>
                                                </MenuList>
                                            </Menu>
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