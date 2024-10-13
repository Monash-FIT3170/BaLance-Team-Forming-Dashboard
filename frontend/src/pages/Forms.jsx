import { useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { MockAuth } from '../helpers/mockAuth';
import { useParams } from 'react-router';
import { AddIcon, ArrowBackIcon, CloseIcon, EmailIcon } from "@chakra-ui/icons";
import {
    Flex,
    VStack,
    Center,
    Text,
    Button,
    useDisclosure,
    Box,
    SimpleGrid,
    TableContainer,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    useToast
} from '@chakra-ui/react';

import {
    NavButton,
    PageHeader
} from "../components/_shared";
import CreateFormModal from "../components/homePage/CreateFormModal";

const Forms = () => {
    const [forms, setForms] = useState([]);
    const { unitCode, year, period } = useParams();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const toast = useToast();

    let authService = {
        DEV: MockAuth,
        TEST: useAuth0,
    };

    const { getAccessTokenSilently } = authService[import.meta.env.VITE_REACT_APP_AUTH]();

    const renderFormCard = (form) => (
        <Box
            key={form.id}
            p={4}
            shadow="md"
            borderWidth="1px"
            borderRadius="md"
            width="100%"
        >
            <Text fontWeight="bold">{form.title}</Text>
            <Text color="gray.500">{form.status}</Text>
        </Box>
    );

    // nice function to automatically copy responder url
    const handleCopy = (url) => {
        navigator.clipboard.writeText(url)
        .then(() => {
            console.log('URL copied successfully'); // Success log
            toast({ 
                title: "Link copied!", 
                description: "The responder URL has been copied to your clipboard.", 
                status: "success", 
                duration: 2000, 
                isClosable: true,
            });
        })
        .catch(err => {
            console.error('Failed to copy: ', err);
        });
    };

    function closeForms(id) {
        getAccessTokenSilently().then((token) => {
      
            fetch(
            `/api/forms/${unitCode}/${year}/${period}/close`,
            {
              method: 'POST',
              headers: new Headers({
                Authorization: `Bearer ${token}`,
                Accept: 'application/json',
                'Content-Type': 'application/json',
              }),
              body: JSON.stringify({id}),
            }
          )
            .then((response) => {
              if (response.ok) {
                toast({
                  title: 'Form closed',
                  description: `Google form for ${unitCode} have been successfully closed.`,
                  status: 'success',
                  duration: 4000,
                  isClosable: true,
              });
              } else {
                return response.text().then((responseText) => {
                  console.log("it worked!!!")
                });
              }
            })
            .catch((error) => {
              console.error('Error sending data to the REST API:', error);
              // Optionally show an error message to the user.
            });
        })
        console.log(id);
    }
    function sendForms(url) {
        getAccessTokenSilently().then((token) => {
      
            fetch(
            `/api/mailing/${unitCode}/${year}/${period}`,
            {
              method: 'POST',
              headers: new Headers({
                Authorization: `Bearer ${token}`,
                Accept: 'application/json',
                'Content-Type': 'application/json',
              }),
              body: JSON.stringify({url}),
            }
          )
            .then((response) => {
              if (response.ok) {
                toast({
                  title: 'Email Sent',
                  description: `Google form(s) for ${unitCode} have been successfully sent to all users. Be sure to tell users to check their spam folder.`,
                  status: 'success',
                  duration: 4000,
                  isClosable: true,
              });
              } else {
                return response.text().then((responseText) => {
                  console.log("it worked!!!")
                });
              }
            })
            .catch((error) => {
              console.error('Error sending data to the REST API:', error);
              // Optionally show an error message to the user.
            });
        }
        )
    };

    useEffect(() => {
        getAccessTokenSilently().then((token) => {
            fetch(`/api/forms/${unitCode}/${year}/${period}`, {
                method: 'get',
                headers: new Headers({
                    Authorization: `Bearer ${token}`,
                }),
            })
                .then((res) => res.json())
                .then((data) => {
                    setForms(data);
                })
                .catch((err) => {
                    console.error('Error fetching forms:', err);
                });
        });
    }, []);

    return (
        <VStack spacing={6}>
            <PageHeader
                fontSize={"2xl"}
                pageDesc={`Google Form Options: ${unitCode} ${period} ${year}`}
            />
            <Center>
                <NavButton
                    buttonIcon={<ArrowBackIcon />}
                    buttonText="Return to offering dashboard"
                    buttonUrl={`/students/${unitCode}/${year}/${period}`}
                />
            </Center>

            <Center>
                <Button
                    leftIcon={<AddIcon />}
                    onClick={onOpen} // Opens the modal
                >
                    Open New Google Form
                </Button>
            </Center>

            {/* Placeholder for Open Forms */}
            <Box width="80%">
                <Text fontSize="xl" fontWeight="bold" mb={4}>
                    Forms In Progress
                </Text>
                <TableContainer>
                    <Table variant="striped">
                    <Thead>
                        <Tr>
                            <Th>Form Type</Th>
                            <Th>Responder URL</Th>
                            <Th></Th>
                            <Th></Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                    {forms &&
                        forms.map((form) => (
                        <Tr key={form.id}> {/* Ensure to add a unique key */}
                            <Td>{form.type}</Td>
                            <Td>{form.url}</Td>
                            <Td>
                                <Button onClick={() => handleCopy(form.url)}>
                                    Copy Link
                                </Button>
                            </Td>
                            <Td>
                                <Button
                                    leftIcon={<EmailIcon />}
                                    onClick={() => {
                                        const confirmed = window.confirm("This will email the form link to ALL students in this unit. Do you wish to continue?");
                                        if (confirmed) {
                                            sendForms(form.url);
                                        }
                                    }}>
                                    Email to All Students
                                </Button>
                            </Td>
                            <Td>
                                <Button
                                    leftIcon={<CloseIcon />}
                                    onClick={() => {
                                        const confirmed = window.confirm("This will close the associated google form, no responses will be accepted after. Do you wish to continue?");
                                        if (confirmed) {
                                            closeForms(form.id);
                                        }
                                    }}>
                                    Close Form
                                </Button>
                            </Td>
                        </Tr>
                    ))}
                    </Tbody>
                </Table>
            </TableContainer>
            </Box>

            {/* Placeholder for Finished Forms
            <Box width="80%">
                <Text fontSize="xl" fontWeight="bold" mt={8} mb={4}>
                    Finished Forms
                </Text>
            </Box> */}

            {/* Modal for creating a new form */}
            <CreateFormModal isModalOpen={isOpen} onModalClose={onClose} />
        </VStack>
    );
}

export default Forms;
