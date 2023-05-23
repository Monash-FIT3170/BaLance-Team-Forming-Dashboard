import { DragHandleIcon, CloseIcon, AddIcon } from '@chakra-ui/icons';
import { MdFilterList } from 'react-icons/md';
import {
  Card,
  CardBody,
  CardHeader,
  Table,
  Icon,
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
  Button,
} from '@chakra-ui/react';
import NavBar from '../components/NavBar.jsx';

function createUnitGroups() {
  return (
    <div>
      <Center margin="40px">
        <Heading>FIT3170 Semester 1 2023 - Lab 1</Heading>
      </Center>

      <SimpleGrid minChildWidth="300">
        <Card border="1px" marginX="20px" marginBottom="20px">
          <CardHeader>
            <HStack>
              <Heading>Lab1 GROUP 1</Heading>
              <Spacer />
              <Button colorScheme="gray" variant="ghost">
                <Icon as={MdFilterList}></Icon>Filter
              </Button>
            </HStack>
          </CardHeader>

          <CardBody margin="15px">
            <TableContainer>
              <Table variant="striped">
                <Thead>
                  <Tr>
                    <Th></Th>
                    <Th>Name</Th>
                    <Th>Email Address</Th>
                    <Th>Lab Number</Th>
                    <Th>WAM average</Th>
                    <Th>Enrolment Status</Th>
                    <Th>DISC Personality</Th>
                  </Tr>
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
                    <Td>Tom</Td>
                    <Td>aaa0000@student.monash.edu</Td>
                    <Td>01</Td>
                    <Td>HD</Td>
                    <Td>ACTIVE</Td>
                    <Td>DOMINANT</Td>
                  </Tr>
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
                    <Td>Jason</Td>
                    <Td>aaa0001@student.monash.edu</Td>
                    <Td>01</Td>
                    <Td>HD</Td>
                    <Td>ACTIVE</Td>
                    <Td>STEADINESS AND INFLUENCE</Td>
                  </Tr>
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
                    <Td>Tiffany</Td>
                    <Td>aaa0002@student.monash.edu</Td>
                    <Td>01</Td>
                    <Td>P</Td>
                    <Td>NOT ACTIVE</Td>
                    <Td>CONSCIENTIOUSNESS</Td>
                  </Tr>
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
                    <Td>Jamima</Td>
                    <Td>aaa0003@student.monash.edu</Td>
                    <Td>01</Td>
                    <Td>D</Td>
                    <Td>ACTIVE</Td>
                    <Td>INFLUENCE</Td>
                  </Tr>
                  <Tr>
                    <Td colspan="7">
                      <Center>
                        <button>
                          <AddIcon />
                        </button>
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
  );
}

export default createUnitGroups;
