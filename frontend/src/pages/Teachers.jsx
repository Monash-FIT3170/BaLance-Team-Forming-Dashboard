import { React, useState } from 'react';
import { useLocation } from 'react-router-dom';

// Chakra imports
import {
  Button,
  Icon,
  Text,
  useColorModeValue,
  Input,
  Select,
  Card,
  CardBody,
  CardHeader,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  SimpleGrid,
  Heading,
  Center,
  Spacer,
  HStack,
  Menu,
  MenuButton,
  MenuList,
  MenuItemOption,
  MenuOptionGroup,
  Box,
} from '@chakra-ui/react';

import { MdFilterList } from 'react-icons/md';
import { DragHandleIcon, CloseIcon, AddIcon, ChevronDownIcon } from '@chakra-ui/icons';

import NavBar from '../components/NavBar.jsx';
import StudentContext from '../store/student-context';

function Teachers() {
  const [checkedValues1, setCheckedValues1] = useState([]);
  const [checkedValues2, setCheckedValues2] = useState([]);
  const [checkedValues3, setCheckedValues3] = useState([]);
  const [checkedValues4, setCheckedValues4] = useState([]);
  const location = useLocation();
  const { jsonData } = location.state;
  
  return (
       <div>
      <Center margin="30px">
        <Heading>Assigning Page</Heading>
      </Center>
      <SimpleGrid minChildWidth="300">
        {stuCtx.students.map((group, index) => (
          <div>
            {group.map((student, innerIndex) => (
                  <Card key={index} border="1px" marginX="20px" marginBottom="20px">
            <CardHeader>
              {/* ... other card header content */}
            </CardHeader>
            <CardBody margin="15px">
              <TableContainer>
                <Table variant="striped" size="md">
                  <Thead>
                    {/* ... table header */}
                  </Thead>
                  <Tbody>
                    <Tr>
                      <Td>
                        <HStack>
                          <button>
                            <CloseIcon />
                          </button>
                          <Spacer />
                          <button>
                            <DragHandleIcon />
                          </button>
                        </HStack>
                      </Td>
                      <Td>{student.id}</Td>
                      <Td>{student.name}</Td>
                      <Td>{student.personality}</Td>
                      <Td>
                        {/* Render labs using SimpleGrid and Menu */}
                      </Td>
                      <Td>
                        <Select placeholder="Select option">
                          <option value="option1">Admin</option>
                          <option value="option2">TA 2</option>
                          <option value="option3">Guest/something else</option>
                        </Select>
                      </Td>
                    </Tr>
                    {/* ... other rows */}
                  </Tbody>
                </Table>
              </TableContainer>
            </CardBody>
          </Card>
              ))}
        </div>
        ))}
      </SimpleGrid>
    </div>
    // <div>
    //   <Center margin="30px">
    //     <Heading>Assigning Page</Heading>
    //   </Center>
    //   <SimpleGrid minChildWidth="300">
    //     <Card border="1px" marginX="20px" marginBottom="20px">
    //       <CardHeader>
    //         <HStack>
    //           <Heading>FIT3170: Software Engineering Practice</Heading>
    //           <Spacer />
    //           <Button colorScheme="gray" variant="ghost">
    //             <Icon as={MdFilterList}></Icon>Filter
    //           </Button>
    //         </HStack>
    //         <Spacer />
    //         <Input placeholder="search" />
    //       </CardHeader>

    //       <CardBody margin="15px">
    //         <TableContainer>
    //           <Table variant="striped" size="md">
    //             <Thead>
    //               <Tr>
    //                 <Th></Th>
    //                 <Th>Name</Th>
    //                 <Th>Email Address</Th>
    //                 <Th>Lab Number</Th>
    //                 <Th>Status</Th>
    //               </Tr>
    //             </Thead>
    //             <Tbody>
    //               <Tr>
    //                 <Td>
    //                   <HStack>
    //                     <button>
    //                       <CloseIcon />
    //                     </button>
    //                     <Spacer />
    //                     <button>
    //                       <DragHandleIcon />
    //                     </button>
    //                   </HStack>
    //                 </Td>
    //                 <Td>teacher1</Td>
    //                 <Td>aaa0000@staff.monash.edu</Td>
    //                 <Td>
    //                   <SimpleGrid columns={{ sm: 1, md: 2, lg: 3 }} spacing="10px">
    //                     {checkedValues1.map((card, index) => (
    //                       <Box key={index} boxShadow="md" rounded="md" p="1">
    //                         <Text fontSize="s">{card}</Text>
    //                       </Box>
    //                     ))}
    //                   </SimpleGrid>
    //                   <br />
    //                   <Menu>
    //                     <MenuButton
    //                       px={4}
    //                       py={2}
    //                       transition="all 0.2s"
    //                       borderRadius="md"
    //                       borderWidth="1px"
    //                       _hover={{ bg: 'gray.400' }}
    //                       _expanded={{ bg: 'blue.400' }}
    //                       _focus={{ boxShadow: 'outline' }}
    //                     >
    //                       Labs <ChevronDownIcon />
    //                     </MenuButton>
    //                     <MenuList>
    //                       <MenuOptionGroup
    //                         type="checkbox"
    //                         value={checkedValues1}
    //                         onChange={setCheckedValues1}
    //                       >
    //                         <MenuItemOption value="lab1">Lab 1</MenuItemOption>
    //                         <MenuItemOption value="lab2">Lab 2</MenuItemOption>
    //                         <MenuItemOption value="lab3">Lab 3</MenuItemOption>
    //                       </MenuOptionGroup>
    //                     </MenuList>
    //                   </Menu>
    //                 </Td>
    //                 <Td>
    //                   <Select placeholder="Select option">
    //                     <option value="option1">Admin</option>
    //                     <option value="option2">TA 2</option>
    //                     <option value="option3">Guest/something else</option>
    //                   </Select>
    //                 </Td>
    //               </Tr>
    //               <Tr>
    //                 <Td>
    //                   <HStack>
    //                     <button>
    //                       <CloseIcon />
    //                     </button>
    //                     <Spacer />
    //                     <button>
    //                       <DragHandleIcon />
    //                     </button>
    //                   </HStack>
    //                 </Td>
    //                 <Td>teacher2</Td>
    //                 <Td>aaa0001@staff.monash.edu</Td>
    //                 <Td>
    //                   <SimpleGrid columns={{ sm: 1, md: 2, lg: 3 }} spacing="10px">
    //                     {checkedValues2.map((card, index) => (
    //                       <Box key={index} boxShadow="md" rounded="md" p="1">
    //                         <Text fontSize="s">{card}</Text>
    //                       </Box>
    //                     ))}
    //                   </SimpleGrid>
    //                   <br />
    //                   <Menu>
    //                     <MenuButton
    //                       px={4}
    //                       py={2}
    //                       transition="all 0.2s"
    //                       borderRadius="md"
    //                       borderWidth="1px"
    //                       _hover={{ bg: 'gray.400' }}
    //                       _expanded={{ bg: 'blue.400' }}
    //                       _focus={{ boxShadow: 'outline' }}
    //                     >
    //                       Labs <ChevronDownIcon />
    //                     </MenuButton>
    //                     <MenuList>
    //                       <MenuOptionGroup
    //                         type="checkbox"
    //                         value={checkedValues2}
    //                         onChange={setCheckedValues2}
    //                       >
    //                         <MenuItemOption value="lab1">Lab 1</MenuItemOption>
    //                         <MenuItemOption value="lab2">Lab 2</MenuItemOption>
    //                         <MenuItemOption value="lab3">Lab 3</MenuItemOption>
    //                       </MenuOptionGroup>
    //                     </MenuList>
    //                   </Menu>
    //                 </Td>
    //                 <Td>
    //                   <Select placeholder="Select option">
    //                     <option value="option1">Admin</option>
    //                     <option value="option2">TA 2</option>
    //                     <option value="option3">Guest/something else</option>
    //                   </Select>
    //                 </Td>
    //               </Tr>
    //               <Tr>
    //                 <Td>
    //                   <HStack>
    //                     <button>
    //                       <CloseIcon />
    //                     </button>
    //                     <Spacer />
    //                     <button>
    //                       <DragHandleIcon />
    //                     </button>
    //                   </HStack>
    //                 </Td>
    //                 <Td>teacher3</Td>
    //                 <Td>aaa0002@staff.monash.edu</Td>
    //                 <Td>
    //                   <SimpleGrid columns={{ sm: 1, md: 2, lg: 3 }} spacing="10px">
    //                     {checkedValues3.map((card, index) => (
    //                       <Box key={index} boxShadow="md" rounded="md" p="1">
    //                         <Text fontSize="s">{card}</Text>
    //                       </Box>
    //                     ))}
    //                   </SimpleGrid>
    //                   <br />
    //                   <Menu>
    //                     <MenuButton
    //                       px={4}
    //                       py={2}
    //                       transition="all 0.2s"
    //                       borderRadius="md"
    //                       borderWidth="1px"
    //                       _hover={{ bg: 'gray.400' }}
    //                       _expanded={{ bg: 'blue.400' }}
    //                       _focus={{ boxShadow: 'outline' }}
    //                     >
    //                       Labs <ChevronDownIcon />
    //                     </MenuButton>
    //                     <MenuList>
    //                       <MenuOptionGroup
    //                         type="checkbox"
    //                         value={checkedValues3}
    //                         onChange={setCheckedValues3}
    //                       >
    //                         <MenuItemOption value="lab1">Lab 1</MenuItemOption>
    //                         <MenuItemOption value="lab2">Lab 2</MenuItemOption>
    //                         <MenuItemOption value="lab3">Lab 3</MenuItemOption>
    //                       </MenuOptionGroup>
    //                     </MenuList>
    //                   </Menu>
    //                 </Td>
    //                 <Td>
    //                   <Select placeholder="Select option">
    //                     <option value="option1">Admin</option>
    //                     <option value="option2">TA 2</option>
    //                     <option value="option3">Guest/something else</option>
    //                   </Select>
    //                 </Td>
    //               </Tr>
    //               <Tr>
    //                 <Td>
    //                   <HStack>
    //                     <button>
    //                       <CloseIcon />
    //                     </button>
    //                     <Spacer />
    //                     <button>
    //                       <DragHandleIcon />
    //                     </button>
    //                   </HStack>
    //                 </Td>
    //                 <Td>teacher4</Td>
    //                 <Td>aaa0003@staff.monash.edu</Td>
    //                 <Td>
    //                   <SimpleGrid columns={{ sm: 1, md: 2, lg: 3 }} spacing="10px">
    //                     {checkedValues4.map((card, index) => (
    //                       <Box key={index} boxShadow="md" rounded="md" p="1">
    //                         <Text fontSize="s">{card}</Text>
    //                       </Box>
    //                     ))}
    //                   </SimpleGrid>
    //                   <br />
    //                   <Menu>
    //                     <MenuButton
    //                       px={4}
    //                       py={2}
    //                       transition="all 0.2s"
    //                       borderRadius="md"
    //                       borderWidth="1px"
    //                       _hover={{ bg: 'gray.400' }}
    //                       _expanded={{ bg: 'blue.400' }}
    //                       _focus={{ boxShadow: 'outline' }}
    //                     >
    //                       Labs <ChevronDownIcon />
    //                     </MenuButton>
    //                     <MenuList>
    //                       <MenuOptionGroup
    //                         type="checkbox"
    //                         value={checkedValues4}
    //                         onChange={setCheckedValues4}
    //                       >
    //                         <MenuItemOption value="lab1">Lab 1</MenuItemOption>
    //                         <MenuItemOption value="lab2">Lab 2</MenuItemOption>
    //                         <MenuItemOption value="lab3">Lab 3</MenuItemOption>
    //                       </MenuOptionGroup>
    //                     </MenuList>
    //                   </Menu>
    //                 </Td>
    //                 <Td>
    //                   <Select placeholder="Select option">
    //                     <option value="option1">Admin</option>
    //                     <option value="option2">TA 2</option>
    //                     <option value="option3">Guest/something else</option>
    //                   </Select>
    //                 </Td>
    //               </Tr>
    //               <Tr>
    //                 <Td colspan="7">
    //                   <Center>
    //                     <button>
    //                       <AddIcon />
    //                     </button>
    //                   </Center>
    //                 </Td>
    //               </Tr>
    //             </Tbody>
    //           </Table>
    //         </TableContainer>
    //       </CardBody>
    //     </Card>
    //   </SimpleGrid>
    // </div>
  );
}

export default Teachers;
